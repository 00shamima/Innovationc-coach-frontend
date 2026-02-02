import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../Services/api';
import Navbar from '../Components/Navbar';
import { Loader2, MessageSquare, User, ArrowRight } from 'lucide-react';

const Search = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');

  useEffect(() => {
    const getSearchResults = async () => {
      if (!searchQuery) return;
      
      setLoading(true);
      try {
        const res = await API.get(`/users/search?query=${searchQuery}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Search API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getSearchResults();
  }, [searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1EB]">
      <Navbar />
      
      <div className="max-w-xl mx-auto w-full p-6 pt-24 pb-20">
        <div className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#800020] italic">
            Search Results
          </h2>
          <p className="text-gray-500 text-sm">Found {users.length} innovators for "{searchQuery}"</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center mt-20 gap-3">
            <Loader2 className="animate-spin text-[#800020]" size={32} />
            <p className="text-[10px] font-bold uppercase text-gray-400">Searching Database...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="grid gap-4">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm border border-[#D8CFC4] hover:border-[#800020] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#F5F1EB]" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#800020] text-white flex items-center justify-center font-black text-xl">
                        {user.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div>
                    <h3 className="font-black text-[#4A2C2A] text-sm uppercase italic">{user.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{user.role || 'Innovator'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                   <button 
                    onClick={() => navigate(`/messages?chatWith=${user.id}`)}
                    className="p-3 bg-[#F5F1EB] text-[#800020] rounded-2xl hover:bg-[#800020] hover:text-white transition-all shadow-sm"
                    title="Message"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button 
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="p-3 bg-white border border-[#D8CFC4] text-gray-700 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                    title="View Profile"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} className="text-gray-300" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase italic">No Innovators Found</p>
            <p className="text-[10px] text-gray-400 mt-2">Try searching with a different name or email</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;