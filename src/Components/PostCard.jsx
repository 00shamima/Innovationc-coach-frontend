import React, { useState, useEffect, useRef } from 'react';
import { Heart, MoreHorizontal, Trash2 } from 'lucide-react';
import API from '../Services/api';

const PostCard = ({ post, onDelete }) => {
  const baseUrl = "http://localhost:5000";
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAuthor = currentUser?.id === post.authorId;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (currentUser && post.likes) {
      setIsLiked(post.likes.some(l => l.userId === currentUser.id));
    }
  }, [post.likes, currentUser]);

  const handleLike = async () => {
    try {
      const { data } = await API.post(`/likes/toggle/${post.id}`);
      if (data.liked) {
        setLikesCount(p => p + 1);
        setIsLiked(true);
      } else {
        setLikesCount(p => p - 1);
        setIsLiked(false);
      }
    } catch (err) {
      alert("Please login!");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this idea?")) {
      try {
        await API.delete(`/posts/${post.id}`);
        onDelete(post.id);
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-[#E3D9CC] mb-8 max-w-[550px] mx-auto overflow-hidden shadow-sm relative">
      
      {/* Top Header */}
      <div className="flex items-center justify-between p-5 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4A0404] rounded-full flex items-center justify-center text-white font-bold text-xs">
            {post.author?.name?.[0].toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-bold text-sm text-[#2B2B2B]">{post.author?.name || "Innovator"}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Settings/Delete Dropdown */}
        {isAuthor && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-black"
            >
              <MoreHorizontal size={22} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1">
                <button 
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 text-[11px] font-black uppercase transition-colors"
                >
                  <Trash2 size={14} /> Delete Idea
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title & Content */}
      <div className="px-5 py-3">
        <h3 className="font-black text-xl text-[#2B2B2B] italic mb-1 uppercase tracking-tight">{post.title}</h3>
        <p className="text-sm text-[#444] font-medium leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.mediaUrl && (
        <div className="bg-gray-50 border-y border-gray-100">
          <img 
            src={`${baseUrl}${post.mediaUrl}`} 
            crossOrigin="anonymous" 
            alt="Post content"
            className="w-full max-h-[450px] object-contain block" 
          />
        </div>
      )}

      {/* Footer - Like Button Only */}
      <div className="p-5 flex items-center">
        <button onClick={handleLike} className="flex items-center gap-1.5 group">
          <Heart 
            size={22} 
            className={isLiked ? "fill-[#4A0404] text-[#4A0404]" : "text-gray-400 group-hover:text-[#4A0404]"} 
          />
          <span className="text-sm font-bold">{likesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;