import React, { useEffect, useState } from 'react';
import PostCard from '../Components/PostCard';
import API from '../Services/api';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await API.get('/posts/feed'); 
        setPosts(data);
      } catch (err) {
        console.error("Error fetching global feed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPosts();
  }, []);

  return (
    <div className="w-full bg-[#FCFAF7]">
      
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-10">
        
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px] bg-[#D4AF37]"></div>
              <h2 className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em]">
                Explore ideas
              </h2>
            </div>
            <h1 className="text-4xl font-black text-[#4A0404] tracking-tighter">
              Global <span className="italic font-serif font-medium text-gray-400">Feed</span>
            </h1>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Ideas</p>
            <p className="text-3xl font-black text-[#4A0404] leading-none">{posts.length}</p>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
              <p className="mt-4 text-sm font-medium text-gray-400 italic">Syncing with the universe...</p>
            </div>
          ) : (
            <>
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}

              {posts.length === 0 && (
                <div className="text-center py-20 opacity-40">
                  <p className="text-gray-500 font-medium italic">No innovations found yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;