import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import PostCard from '../Components/PostCard';
import API from '../Services/api';
import { useNavigate } from 'react-router-dom';
import { Settings, FileText, CheckCircle, Clock, Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ 
    user: null, 
    myPosts: [], 
    pagination: { totalPages: 1, totalPosts: 0 } 
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/my-activity?page=${currentPage}&limit=5`);
      setData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data?.message || err.message);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboard();
  }, [currentPage, navigate]);

  const stats = {
    total: data.pagination?.totalPosts || 0,
    accepted: data.myPosts?.filter(p => p.status === 'APPROVED').length || 0,
    pending: data.myPosts?.filter(p => p.status === 'PENDING').length || 0
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F5F1EB]">
      <Loader2 className="animate-spin text-[#800020]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F1EB] pb-24">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24">
        <div className="bg-white rounded-[35px] p-8 shadow-sm border border-[#D8CFC4] text-center mb-6 relative">
          <button onClick={() => navigate('/settings')} className="absolute top-6 right-6 p-2 bg-[#F5F1EB] rounded-full text-[#800020]">
            <Settings size={20} />
          </button>
          <div className="w-24 h-24 rounded-full mx-auto border-4 border-[#F5F1EB] mb-4 overflow-hidden shadow-md bg-gray-100">
            <img 
              src={data.user?.profilePic || `https://ui-avatars.com/api/?name=${data.user?.name || 'User'}&background=800020&color=fff`} 
              className="w-full h-full object-cover" 
              alt="Profile" 
            />
          </div>
          <h2 className="text-2xl font-black text-[#4A2C2A] uppercase italic">{data.user?.name || "Loading..."}</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase mt-1 italic tracking-widest">
            {data.user?.bio || "No bio added"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
          <StatBox 
            icon={<FileText size={20}/>} 
            label="Total Ideas" 
            count={stats.total} 
            active={activeFilter === 'ALL'} 
            onClick={() => setActiveFilter('ALL')}
          />
          <StatBox 
            icon={<CheckCircle size={20}/>} 
            label="Accepted" 
            count={stats.accepted} 
            active={activeFilter === 'ACCEPTED'} 
            onClick={() => setActiveFilter('ACCEPTED')}
            color="bg-green-500"
          />
          <StatBox 
            icon={<Clock size={20}/>} 
            label="Pending" 
            count={stats.pending} 
            active={activeFilter === 'PENDING'} 
            onClick={() => setActiveFilter('PENDING')}
            color="bg-orange-400"
          />
        </div>

        <div className="space-y-6">
          {data.myPosts?.length > 0 ? (
            data.myPosts.map(post => (
              <PostCard key={post.id} post={post} refreshFeed={fetchDashboard} />
            ))
          ) : (
            <div className="text-center py-20 bg-white/50 border-2 border-dashed border-[#D8CFC4] rounded-[35px]">
               <p className="text-gray-300 font-black italic uppercase text-xs">No innovations found</p>
            </div>
          )}
        </div>

        {data.pagination?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-12 pb-10">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white rounded-full border shadow-sm disabled:opacity-20 text-[#800020]">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Page {currentPage} of {data.pagination.totalPages}
            </span>
            <button disabled={currentPage === data.pagination.totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white rounded-full border shadow-sm disabled:opacity-20 text-[#800020]">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, count, active, onClick, color = "bg-[#800020]" }) => (
  <div onClick={onClick} className={`p-5 rounded-[25px] border text-center cursor-pointer transition-all ${active ? `${color} text-white scale-105 shadow-md` : 'bg-white border-[#D8CFC4] text-[#4A2C2A]'}`}>
    <div className="mx-auto mb-2 flex justify-center">{icon}</div>
    <div className="text-xl font-black">{count}</div>
    <div className="text-[8px] font-black uppercase tracking-tighter">{label}</div>
  </div>
);

export default UserDashboard;