import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, Lightbulb } from 'lucide-react';
import API from '../Services/api';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'USER' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      alert(`Registration Successful! Please login.`);
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-6 font-sans">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-[380px] border border-gray-100">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4A0404] rounded-2xl mb-4 shadow-lg rotate-3">
            <Lightbulb className="text-[#D4AF37]" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-1 text-[10px] font-bold uppercase tracking-widest italic">Join the innovation ecosystem</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
    
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
              <input 
                type="text" 
                name="name" 
                placeholder="Enter your name" 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#4A0404] focus:ring-4 focus:ring-[#4A0404]/5 outline-none text-sm font-medium transition-all shadow-sm" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

         
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
              <input 
                type="email" 
                name="email" 
                placeholder="name@domain.com" 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#4A0404] focus:ring-4 focus:ring-[#4A0404]/5 outline-none text-sm font-medium transition-all shadow-sm" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#4A0404] focus:ring-4 focus:ring-[#4A0404]/5 outline-none text-sm font-medium transition-all shadow-sm" 
                onChange={handleChange} 
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
            {loading ? <Loader2 className="animate-spin" size={20} /> : "GET STARTED"}
          </button>
        </form>

      
        <div className="mt-10 text-center pt-6 border-t border-gray-50">
          <p className="text-gray-400 text-xs font-medium">
            Already have an account? <Link to="/" className="text-[#4A0404] font-bold ml-1 hover:underline underline-offset-4 tracking-tight">SIGN IN</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;