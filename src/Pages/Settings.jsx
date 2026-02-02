import React, { useState, useEffect, useRef } from 'react';
import API from '../Services/api';
import { Camera, User, Mail, FileText, Save, ChevronLeft, Loader2, Lock, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // view: 'menu', 'profile', or 'password'
  const [view, setView] = useState('menu');
  
  const [formData, setFormData] = useState({ 
    name: '', email: '', bio: '', 
    password: '', confirmPassword: '' 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // Load User Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await API.get('/users/my-activity');
        setFormData(prev => ({
          ...prev,
          name: data.user?.name || '',
          email: data.user?.email || '',
          bio: data.user?.bio || ''
        }));
        if (data.user?.profilePic) setPreviewUrl(data.user.profilePic);
      } catch (err) { console.error("Data load failed"); }
    };
    loadData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (view === 'password') {
      if (!formData.password) return setStatus({ type: 'error', msg: 'Enter new password!' });
      if (formData.password !== formData.confirmPassword) {
        return setStatus({ type: 'error', msg: 'Passwords do not match!' });
      }
    }

    setLoading(true);
    const data = new FormData();
    if (view === 'profile') {
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('bio', formData.bio); 
      if (selectedFile) data.append('profilePic', selectedFile);
    } else {
      data.append('password', formData.password);
    }

    try {
      const res = await API.put('/users/update-profile', data);
      if (res.data.user?.profilePic) localStorage.setItem('userPic', res.data.user.profilePic);
      setStatus({ type: 'success', msg: 'Updated successfully! ✅' });
      // Go back to menu after success
      setTimeout(() => { setView('menu'); setStatus({type:'', msg:''}); }, 1200);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Update Failed!' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-50">
        <button onClick={() => view === 'menu' ? navigate(-1) : setView('menu')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={28} className="text-[#4A2C2A]" />
        </button>
        <h2 className="text-xl font-black italic text-[#4A2C2A]">
          {view === 'menu' ? 'Settings' : view === 'profile' ? 'Edit Profile' : 'Reset Password'}
        </h2>
      </div>

      {status.msg && (
        <div className={`m-4 p-3 rounded-xl text-center font-bold text-sm ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {status.msg}
        </div>
      )}

      {/* --- MAIN MENU VIEW (Instagram Style) --- */}
      {view === 'menu' && (
        <div className="divide-y divide-gray-100">
          <button onClick={() => setView('profile')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
              <span className="font-bold text-[#4A2C2A]">Edit Profile</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>

          <button onClick={() => setView('password')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShieldCheck size={20} /></div>
              <span className="font-bold text-[#4A2C2A]">Password & Security</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        </div>
      )}

      {/* --- EDIT PROFILE FORM --- */}
      {view === 'profile' && (
        <form onSubmit={handleUpdate} className="p-6 space-y-6 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col items-center mb-4">
            <div className="relative cursor-pointer group" onClick={() => fileInputRef.current.click()}>
              <div className="w-24 h-24 rounded-full border-4 border-[#F5F1EB] overflow-hidden bg-gray-100">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">{formData.name[0]}</div>}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
            }} />
            <button type="button" onClick={() => fileInputRef.current.click()} className="mt-2 text-blue-600 font-bold text-xs">Change Profile Picture</button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Name</label>
               <input className="w-full p-4 bg-[#F5F1EB] rounded-2xl outline-none font-bold text-[#4A2C2A]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email</label>
               <input className="w-full p-4 bg-[#F5F1EB] rounded-2xl outline-none font-bold text-[#4A2C2A]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Bio</label>
               <textarea className="w-full p-4 bg-[#F5F1EB] rounded-2xl outline-none font-bold text-[#4A2C2A] h-24 resize-none" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#800020] text-white py-4 rounded-2xl font-black shadow-lg">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Changes'}
          </button>
        </form>
      )}

      {/* --- PASSWORD RESET FORM --- */}
      {view === 'password' && (
        <form onSubmit={handleUpdate} className="p-6 space-y-6 animate-in slide-in-from-right duration-300">
          <div className="bg-[#F5F1EB] p-4 rounded-2xl">
            <p className="text-xs font-bold text-[#4A2C2A] leading-relaxed">Ensure your new password is secure. We recommend using a mix of letters and numbers.</p>
          </div>
          <div className="space-y-4">
            <input type="password" placeholder="New Password" className="w-full p-4 bg-[#F5F1EB] rounded-2xl outline-none font-bold" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <input type="password" placeholder="Confirm Password" className="w-full p-4 bg-[#F5F1EB] rounded-2xl outline-none font-bold" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#800020] text-white py-4 rounded-2xl font-black shadow-lg">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Settings;