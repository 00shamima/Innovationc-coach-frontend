import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, Lock, Loader2, ArrowLeft, Lightbulb } from 'lucide-react';
import API from '../Services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/forgot-password', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Email not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/reset-password', { email, otp, newPassword });
      alert("Password updated successfully!");
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or Expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-6 font-sans">
      <div className="bg-white p-8 pt-16 rounded-[2.5rem] shadow-xl w-full max-w-[380px] border border-gray-100 relative">
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <button 
            onClick={() => step === 2 ? setStep(1) : navigate('/')} 
            className="group flex items-center gap-2 px-4 py-2 bg-[#4A0404]/5 hover:bg-[#4A0404] text-[#4A0404] hover:text-[#D4AF37] rounded-full text-[10px] font-bold uppercase transition-all duration-300"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4A0404] rounded-2xl mb-4 shadow-lg rotate-3">
            <Lightbulb className="text-[#D4AF37]" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {step === 1 ? "Forgot Password?" : "Reset Security"}
          </h1>
          <p className="text-gray-400 mt-1 text-[10px] font-bold uppercase tracking-widest italic">
            {step === 1 ? "Enter email to receive OTP" : "Set your new credentials"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-[11px] font-bold rounded-xl border border-red-100 text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                <input 
                  type="email" 
                  placeholder="yourname@domain.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#4A0404] outline-none text-sm shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#4A0404] text-[#D4AF37] rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "SEND OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Verification OTP</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#4A0404] outline-none text-sm font-bold tracking-[0.3em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#4A0404] outline-none text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#4A0404] text-[#D4AF37] rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "UPDATE PASSWORD"}
            </button>
          </form>
        )}

        <div className="mt-10 text-center pt-6 border-t border-gray-50">
          <p className="text-gray-400 text-[10px] font-medium leading-relaxed">
            Need help? Contact support@innovationcoach.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;