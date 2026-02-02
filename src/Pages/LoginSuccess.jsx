import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2, Clock } from 'lucide-react';
import API from '../Services/api';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const userName = queryParams.get('userName') || 'Innovator';
    
    const [status, setStatus] = useState("Awaiting Admin Approval");
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        if (!email) return;

        const checkUserStatus = async () => {
            try {
                const res = await API.get(`/auth/check-status/${encodeURIComponent(email)}`);
                
                if (res.data && res.data.isApproved === true) {
                    setIsApproved(true);
                    setStatus("Access Granted!");
                    
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('userName', res.data.userName);
                    
                    setTimeout(() => {
                        navigate('/');
                        window.location.reload();
                    }, 2000);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        };

        const pollInterval = setInterval(checkUserStatus, 3000);

        return () => clearInterval(pollInterval);
    }, [email, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 text-white">
            <div className="w-full max-w-[450px] text-center space-y-8">
                <div className="relative inline-block">
                    <div className={`w-24 h-24 rounded-full border-4 ${isApproved ? 'border-green-500' : 'border-[#881337] border-t-transparent animate-spin'} mx-auto`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {isApproved ? <ShieldCheck className="text-green-500" size={40} /> : <Clock className="text-[#881337]" size={30} />}
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className={`text-3xl font-black uppercase tracking-tighter ${isApproved ? 'text-green-500' : 'text-white'}`}>
                        {status}
                    </h2>
                    <p className="text-white/40 text-sm italic">Verification in progress for {email}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md">
                    <p className="text-white/60 leading-relaxed text-sm">
                        Hello <span className="text-white font-bold">{userName}</span>, <br />
                        Your account has been registered successfully. For security reasons, an administrator must manually verify your profile before you can access the dashboard.
                    </p>
                    {!isApproved && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-[#881337] tracking-[0.2em] uppercase animate-pulse">
                            <Loader2 size={12} className="animate-spin" /> Live Polling Active
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => navigate('/login')}
                    className="text-white/20 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                    ← Back to Login
                </button>
            </div>
        </div>
    );
};

export default LoginSuccess;