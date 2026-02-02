import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import API from '../Services/api';
import { 
  Send, 
  ArrowLeft, 
  Phone, 
  Paperclip, 
  MoreVertical, 
  Sparkles, 
  MessageSquare,
  Home
} from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef();

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const queryParams = new URLSearchParams(location.search);
  const chatWithId = queryParams.get('chatWith');

  const MAROON = "#4A0404";
  const GOLD = "#D4AF37";
  const LIGHT_BEIGE = "#FAF9F6";

  // --- UNGA ORIGINAL LOGIC (No changes here) ---
  useEffect(() => {
    const newSocket = io("https://innovationc-coach-backend.onrender.com"); 
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && currentUser?.id) socket.emit("addNewUser", currentUser.id);
  }, [socket, currentUser]);

  useEffect(() => {
    if (!socket) return;
    socket.on("getMessage", (res) => {
      if (String(selectedChat?.id) === String(res.senderId)) {
        setMessages((prev) => [...prev, res]);
      }
    });
    return () => socket.off("getMessage");
  }, [socket, selectedChat]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/messages/conversations');
        setConversations(res.data || []);
        if (chatWithId) {
          const userRes = await API.get(`/users/profile/${chatWithId}`);
          setSelectedChat(userRes.data);
        }
      } catch (err) { console.error("Error fetching conversations:", err); }
    };
    fetchData();
  }, [chatWithId]);

  useEffect(() => {
    if (selectedChat?.id) {
      API.get(`/messages/history/${selectedChat.id}`)
        .then(res => setMessages(res.data || []))
        .catch(err => console.error("Error fetching history:", err));
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedChat) return;
    
    const tempMsg = { 
      senderId: currentUser.id, 
      receiverId: selectedChat.id, 
      text: newMessage, 
      createdAt: new Date().toISOString() 
    };

    try {
      setMessages((prev) => [...prev, tempMsg]);
      setNewMessage("");
      await API.post('/messages/send', { receiverId: selectedChat.id, text: newMessage });
      socket.emit("sendMessage", tempMsg);
    } catch (err) { console.error("Error sending message:", err); }
  };
  // --- END OF LOGIC ---

  return (
    // Fixed: Changed h-full to h-screen to fill browser window
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: LIGHT_BEIGE }}>
      
      {/* Sidebar */}
      <div className={`w-full md:w-[350px] border-r border-gray-200 flex flex-col bg-white shrink-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="mr-2 md:hidden">
              <ArrowLeft size={20} style={{ color: MAROON }} />
            </button>
            <h1 className="text-xl font-black italic uppercase tracking-tighter" style={{ color: MAROON }}>
              Inbox
            </h1>
          </div>
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: MAROON }}>
             <Sparkles size={16} style={{ color: GOLD }} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? conversations.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat)} 
              className={`p-4 flex items-center gap-3 cursor-pointer border-b transition-all ${selectedChat?.id === chat.id ? 'bg-[#FDF8E1]' : 'hover:bg-gray-50'}`}
              style={selectedChat?.id === chat.id ? { borderRight: `4px solid ${GOLD}` } : {}}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 border-2" 
                   style={{ backgroundColor: MAROON, color: GOLD, borderColor: GOLD }}>
                {chat.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{chat.name}</p>
                <p className="text-xs text-gray-500 truncate italic tracking-tight">Open conversation</p>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-gray-400 text-sm italic">No conversations found.</div>
          )}
        </div>

        <div className="hidden md:block p-4 border-t">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-gray-200 hover:bg-gray-50"
            style={{ color: MAROON }}
          >
            <Home size={14} /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-full ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {selectedChat ? (
          <div className="flex flex-col h-full relative">
            
            {/* Header (Fixed) */}
            <div className="h-16 px-4 bg-white border-b flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedChat(null)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
                >
                  <ArrowLeft size={20} style={{ color: MAROON }} />
                </button>
                <button 
                  onClick={() => navigate('/')} 
                  className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Exit to Home"
                >
                  <Home size={20} style={{ color: MAROON }} />
                </button>
                
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border" 
                     style={{ backgroundColor: MAROON, color: GOLD, borderColor: GOLD }}>
                  {selectedChat.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black uppercase text-xs tracking-widest" style={{ color: MAROON }}>{selectedChat.name}</p>
                  <span className="text-[10px] font-bold text-green-600">ONLINE</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone size={18} style={{ color: MAROON }} className="cursor-pointer opacity-70 hover:opacity-100" />
                <MoreVertical size={20} style={{ color: MAROON }} className="cursor-pointer opacity-70 hover:opacity-100" />
              </div>
            </div>

            {/* Messages - Flex-1 makes it fill all available space */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, i) => {
                const isMine = String(msg.senderId) === String(currentUser.id);
                return (
                  <div key={i} className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm relative ${
                      isMine ? 'text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}
                    style={isMine ? { backgroundColor: MAROON } : {}}
                    >
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      <p className={`text-[8px] text-right mt-1 font-bold uppercase tracking-tighter ${isMine ? 'text-gray-300' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Input Area (Natural Position at bottom) */}
            <div className="p-4 bg-white md:bg-transparent border-t md:border-none">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-2">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <div className="flex gap-1 ml-2">
                    <Paperclip size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                  
                  <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type your message..." 
                    className="flex-1 bg-transparent border-none py-3 px-2 text-sm outline-none placeholder:italic" 
                  />

                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="p-3 rounded-xl transition-all shadow-lg flex items-center justify-center"
                    style={{ 
                        backgroundColor: newMessage.trim() ? MAROON : '#f3f4f6',
                        color: newMessage.trim() ? GOLD : '#9ca3af'
                    }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
              {/* Gap for Mobile Bottom Navigation */}
              <div className="h-4 md:hidden"></div> 
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl" 
                 style={{ backgroundColor: MAROON }}>
              <MessageSquare size={40} style={{ color: GOLD }} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2" style={{ color: MAROON }}>
              Innovator Hub
            </h2>
            <p className="text-gray-500 max-w-xs text-sm font-medium mb-6">
              Select a partner to start discussing your next big idea.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded-full font-bold text-xs uppercase border-2 transition-all hover:bg-maroon-50"
              style={{ color: MAROON, borderColor: MAROON }}
            >
              Back to Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;