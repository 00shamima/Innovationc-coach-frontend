import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../Services/api'; 

const ForgotPassword = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setStep(2); 
    } catch (err) {
      alert(err.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { email, otp, newPassword });
      alert("Password changed! Now login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ padding: '30px', border: '1px solid #ccc', borderRadius: '20px', width: '350px' }}>
        
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <h2 className='font-bold text-xl mb-4'>Forgot Password</h2>
            <input 
              type="email" placeholder="Your Email" className='w-full p-3 mb-4 border rounded'
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
            <button className='w-full bg-black text-white p-3 rounded'>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <h2 className='font-bold text-xl mb-4'>Reset Password</h2>
            <p className='text-xs text-gray-500 mb-4 uppercase'>Enter OTP sent to {email}</p>
            <input 
              type="text" placeholder="6-Digit OTP" className='w-full p-3 mb-4 border rounded'
              value={otp} onChange={(e) => setOtp(e.target.value)} required 
            />
            <input 
              type="password" placeholder="New Password" className='w-full p-3 mb-4 border rounded'
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required 
            />
            <button className='w-full bg-blue-600 text-white p-3 rounded'>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
        
      </div>
    </div>
  );
};

export default ForgotPassword;