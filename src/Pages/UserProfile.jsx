import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../Services/api';
import { Lightbulb, Heart, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import Navbar from '../Components/Navbar';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/users/profile/${userId}`); 
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Innovator not found.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUserProfile();
  }, [userId]);

  const handleMessageClick = () => {
    navigate(`/messages?chatWith=${userId}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1EB]">
      <Loader2 className="animate-spin text-[#800020]" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F1EB] pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4 mt-16">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-[#4A2C2A] opacity-50 hover:opacity-100 font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={14} /> Back to Feed
        </button>

        <div className="bg-white rounded-[35px] p-8 border border-[#D8CFC4] shadow-sm mb-10 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 rounded-full border-4 border-[#F5F1EB] overflow-hidden shadow-md bg-white">
              {profile.profilePic ? (
                <img src={profile.profilePic} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#800020] text-white flex items-center justify-center text-4xl font-black uppercase italic">
                  {profile.name[0]}
                </div>
              )}
            </div>
          </div>

          <h2 className="text-3xl font-black text-[#4A2C2A] uppercase italic tracking-tighter">{profile.name}</h2>
          
          <div className="flex flex-col items-center gap-4 mt-2">
            <span className="text-[#800020] font-black text-[10px] uppercase tracking-[0.2em] bg-[#F5F1EB] px-4 py-1 rounded-full">
              {profile.role || 'Innovator'}
            </span>

            {userId !== currentUserId && (
              <button 
                onClick={handleMessageClick}
                className="flex items-center gap-2 bg-[#800020] text-white px-10 py-3 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:shadow-xl active:scale-95 transition-all"
              >
                <MessageCircle size={16} /> Message
              </button>
            )}
          </div>

          {profile.bio && (
            <div className="mt-8 pt-6 border-t border-[#F5F1EB]">
               <p className="text-[#4A2C2A] italic font-bold leading-relaxed opacity-80">"{profile.bio}"</p>
            </div>
          )}
        </div>

        {/* Innovations List */}
        <div className="flex items-center gap-2 mb-6 px-2">
           <Lightbulb size={18} className="text-[#800020]" />
           <h3 className="text-xs font-black text-[#4A2C2A] uppercase tracking-widest italic">Shared Innovations</h3>
        </div>

        <div className="space-y-6">
          {profile.posts && profile.posts.length > 0 ? profile.posts.map((post) => (
            <div key={post.id} className="bg-white p-8 rounded-[30px] border border-[#D8CFC4] shadow-sm">
              <h4 className="text-xl font-black text-[#4A2C2A] mb-3 italic tracking-tight uppercase">{post.title}</h4>
              <p className="text-gray-500 font-bold leading-relaxed mb-6">{post.content}</p>
              
              <div className="flex items-center justify-between pt-5 border-t border-[#F5F1EB]">
                <div className="flex items-center gap-2 text-[#800020] bg-[#F5F1EB] px-4 py-1.5 rounded-full text-[10px] font-black">
                  <Heart size={14} fill="currentColor" /> {post._count?.likes || 0}
                </div>
                <span className="text-[10px] font-black text-gray-300 uppercase italic">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-[35px] border-2 border-dashed border-[#D8CFC4] text-gray-300 font-black italic uppercase text-xs tracking-widest">
              No ideas shared yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;