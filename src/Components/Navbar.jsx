import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Lightbulb, MessageSquare, Search, X, LogOut, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || "Innovator";

  const isActive = (path) => location.pathname === path;

  const isMessagesPage = location.pathname === '/messages';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Header - Always Visible */}
      <nav className="fixed top-0 left-0 right-0 z-[110] bg-white border-b border-gray-100 shadow-sm h-16 flex items-center">
        <div className="max-w-4xl mx-auto w-full px-6 flex justify-between items-center">
          {isSearchOpen ? (
            <div className="w-full flex items-center gap-3 animate-in fade-in duration-200">
              <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 h-10 border border-gray-200">
                <Search size={18} className="text-gray-400" />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ideas..."
                  className="w-full p-2 text-sm outline-none bg-transparent font-medium"
                />
              </form>
              <button onClick={() => setIsSearchOpen(false)} className="text-gray-500">
                <X size={22} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="bg-[#4A0404] p-1.5 rounded-lg shadow-sm group-hover:rotate-3 transition-transform">
                  <Sparkles size={16} className="text-[#D4AF37]" />
                </div>
                <h1 className="text-xl font-black text-[#4A0404] tracking-tighter uppercase italic">
                  Innovation
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setIsSearchOpen(true)} className="text-gray-600 hover:text-[#4A0404] transition-colors">
                  <Search size={22} strokeWidth={2.5} />
                </button>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors">
                  <LogOut size={20} />
                </button>
                <div 
                  className="w-9 h-9 rounded-full border-2 border-[#D4AF37] overflow-hidden cursor-pointer shadow-sm"
                  onClick={() => navigate('/user')}
                >
                  <img src={`https://ui-avatars.com/api/?name=${userName}&background=4A0404&color=D4AF37&bold=true`} alt="user" className="w-full h-full object-cover" />
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Bottom Navigation - HIDDEN ON MESSAGES PAGE */}
      {!isMessagesPage && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[110] h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          <div className="max-w-md mx-auto h-full flex justify-around items-center px-4">
            <Link to="/" className={`flex flex-col items-center gap-0.5 transition-all ${isActive('/') ? 'text-[#4A0404] scale-105' : 'text-gray-400'}`}>
              <Home size={22} fill={isActive('/') ? "#4A0404" : "none"} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
            </Link>

            <Link to="/create-post" className={`flex flex-col items-center gap-0.5 transition-all ${isActive('/create-post') ? 'text-[#4A0404] scale-105' : 'text-gray-400'}`}>
              <Lightbulb size={22} fill={isActive('/create-post') ? "#4A0404" : "none"} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Ideas</span>
            </Link>

            <Link to="/messages" className={`flex flex-col items-center gap-0.5 transition-all ${isActive('/messages') ? 'text-[#4A0404] scale-105' : 'text-gray-400'}`}>
              <MessageSquare size={22} fill={isActive('/messages') ? "#4A0404" : "none"} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Chats</span>
            </Link>

            <Link to="/user" className={`flex flex-col items-center gap-0.5 transition-all ${isActive('/user') ? 'text-[#4A0404] scale-105' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black border-2 transition-all ${isActive('/user') ? 'border-[#4A0404] bg-[#4A0404] text-[#D4AF37]' : 'border-gray-200 text-gray-400'}`}>
                {userName[0].toUpperCase()}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Me</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;