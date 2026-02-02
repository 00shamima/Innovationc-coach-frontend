import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, Bell, Clock } from 'lucide-react';
import API from '../Services/api';
import Navbar from '../Components/Navbar';

const MyActivity = () => {
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const filterStatus = new URLSearchParams(location.search).get('status');

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        // FIXED: Added 's' to /users/ to match server.js
        const { data } = await API.get('/users/my-activity');
        
        setNotifications(data.notifications || []);
        
        if (filterStatus) {
          setPosts(data.myPosts.filter(p => p.status === filterStatus));
        } else {
          setPosts(data.myPosts || []);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [filterStatus]);

  if (loading) return (
    <div className="p-10 text-center font-black italic text-blue-600 animate-pulse uppercase tracking-tighter">
      Syncing Activity...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        
       
        <div className="mb-10">
          <h2 className="text-lg font-black flex items-center gap-2 mb-4 text-slate-800 italic uppercase tracking-tighter">
            <Bell size={20} className="text-blue-600"/> Recent Activity
          </h2>
          <div className="space-y-3">
            {notifications.length > 0 ? notifications.map((n) => (
              <div key={n.id} className="bg-white p-4 rounded-2xl border border-blue-50 flex items-center gap-4 shadow-sm hover:scale-[1.01] transition-transform">
                <div className="bg-pink-50 p-2 rounded-full text-pink-500 shadow-inner">
                  <Heart size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm text-slate-700">
                    <span className="font-black text-slate-900 uppercase text-[12px]">{n.senderName}</span> 
                    <span className="ml-1 italic font-medium text-slate-500">liked your post</span> 
                    <span className="ml-1 font-black text-blue-600 italic">"{n.postTitle || "Idea"}"</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm italic text-center p-4 bg-white rounded-2xl border border-dashed border-slate-200">No recent activity found.</p>
            )}
          </div>
        </div>

        <hr className="mb-10 border-slate-200" />

        
        <div>
          <h2 className="text-lg font-black mb-4 uppercase text-slate-800 tracking-tighter italic">
            {filterStatus ? `${filterStatus} IDEAS` : "My Idea Tracker"}
          </h2>
          <div className="space-y-4">
            {posts.length > 0 ? posts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-all group">
                <div>
                  <h3 className="font-black text-slate-800 text-base group-hover:text-blue-600 transition-colors tracking-tight">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Clock size={10}/> {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-blue-500 font-black flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                      <Heart size={10} fill="currentColor"/> {post._count?.likes || 0}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  post.status === 'APPROVED' ? 'bg-green-500 text-white' :
                  post.status === 'PENDING' ? 'bg-orange-400 text-white' : 'bg-red-500 text-white'
                }`}>
                  {post.status}
                </span>
              </div>
            )) : (
              <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-bold italic">
                No ideas found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyActivity;