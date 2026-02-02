import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Lock, Loader2, ArrowLeft, Lightbulb } from 'lucide-react';
import API from '../Services/api';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '', 
    otp: '',
    newPassword: ''
  });

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/reset-password', formData);
      alert(response.data.message);
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or Expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-6 font-sans">
      <div className="bg-white p-8 pt-16 rounded-[2.5rem] shadow-xl w-full max-w-[380px] border border-gray-100 relative">
        
        <div className="absolute top-6 left-6">
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center gap-2 px-4 py-2 bg-[#4A0404]/5 hover:bg-[#4A0404] text-[#4A0404] hover:text-[#D4AF37] rounded-full text-[10px] font-bold uppercase transition-all duration-300 shadow-sm border border-[#4A0404]/10 active:scale-95"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4A0404] rounded-2xl mb-4 shadow-lg rotate-3">
            <Lightbulb className="text-[#D4AF37]" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Security Reset</h1>
          <p className="text-gray-400 mt-1 text-[10px] font-bold uppercase tracking-widest italic">Update your credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-[11px] font-bold rounded-xl border border-red-100 text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          {/* Email (Read Only) */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Registered Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
              <input 
                type="email" 
                value={formData.email}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 text-sm font-medium outline-none cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Enter OTP</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
              <input 
                type="text" 
                maxLength="6"
                placeholder="123456"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#4A0404] outline-none text-sm font-bold tracking-[0.5em] transition-all shadow-sm"
                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#4A0404] outline-none text-sm font-medium transition-all shadow-sm"
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-95 ${
              loading 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-[#4A0404] text-[#D4AF37] hover:bg-black"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "UPDATE PASSWORD"}
          </button>
        </form>

\        <div className="mt-10 text-center pt-6 border-t border-gray-50">
          <p className="text-gray-400 text-[10px] font-medium leading-relaxed">
            Verify the code sent to your email. <br/> 
            Haven't received it? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;