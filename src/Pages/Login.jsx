import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff, Lightbulb, Rocket, Users } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import API from '../Services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login', formData);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/');

    } catch (err) {
      if (err.response?.status === 403) {
        const userName = err.response.data.userName || 'User';
        navigate(`/login-success?status=pending&userName=${encodeURIComponent(userName)}&email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/google-login', { idToken: credentialResponse.credential });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      navigate('/');
    } catch (err) {
      setError("Google Login Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email first!");
      return;
    }
    setOtpLoading(true);
    try {
      await API.post('/auth/forgot-password', { email: formData.email });
      alert("OTP has been sent to your email!");
      navigate('/reset-password', { state: { email: formData.email } });
    } catch (err) {
      setError("Failed to send OTP. Check if email is registered.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#FDFBF7] font-sans overflow-hidden">
      {/* Left Side: Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6">
        <div className="w-full max-w-[340px]">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#4A0404] rounded-lg flex items-center justify-center">
                <Lightbulb className="text-[#D4AF37]" size={18} />
              </div>
              <span className="text-lg font-bold text-[#4A0404] italic">InnovationCoach</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Login</h1>
            <p className="text-gray-500 text-xs mt-1">Submit your ideas and grow with experts.</p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg border border-red-100 text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="yourname@idea.com"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-[13px] outline-none focus:border-[#4A0404] focus:ring-2 focus:ring-[#4A0404]/5 transition-all shadow-sm"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-[10px] font-bold text-[#4A0404] hover:underline">
                   {otpLoading ? "Sending..." : "Forgot?"}
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-[13px] outline-none focus:border-[#4A0404] focus:ring-2 focus:ring-[#4A0404]/5 transition-all shadow-sm"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#4A0404] hover:bg-black text-[#D4AF37] font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 active:scale-95 disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Login to Workspace"}
            </button>
          </form>

          {/* Google Login Section */}
          <div className="mt-6">
            <div className="relative flex items-center mb-5">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="mx-3 text-[9px] font-bold text-gray-300 uppercase tracking-widest">Or login with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>
            <div className="flex justify-center border border-gray-100 rounded-xl p-0.5 bg-white shadow-sm overflow-hidden scale-95">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Error")} theme="outline" shape="pill" width="300px" />
            </div>
          </div>

          <p className="mt-6 text-center text-gray-400 text-[11px] font-medium">
            Not registered? <Link to="/register" className="text-[#4A0404] font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Decorative Section */}
      <div className="hidden lg:flex w-[60%] bg-[#4A0404] m-3 rounded-[1.5rem] relative overflow-hidden items-center justify-center border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#D4AF37] rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 text-center px-10">
          <div className="bg-[#D4AF37] text-[#4A0404] inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
              Innovation Hub
          </div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-8 tracking-tight">
            Build your project with <br/> <span className="text-[#D4AF37] italic font-serif">the right mentorship.</span>
          </h2>
          
          <div className="flex gap-4 justify-center mt-10">
             <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm text-left w-48 transition-all hover:bg-white/10">
                <Rocket className="text-[#D4AF37] mb-3" size={20} />
                <div className="text-white text-sm font-bold">Post Ideas</div>
                <div className="text-white/40 text-[10px] mt-1">Share your vision with the coach.</div>
             </div>
             <div className="bg-[#D4AF37] p-5 rounded-2xl text-left w-48 shadow-xl translate-y-4 transition-all hover:-translate-y-1">
                <Users className="text-[#4A0404] mb-3" size={20} />
                <div className="text-[#4A0404] text-sm font-bold">Expert Review</div>
                <div className="text-[#4A0404]/60 text-[10px] mt-1">Get feedback to scale fast.</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;