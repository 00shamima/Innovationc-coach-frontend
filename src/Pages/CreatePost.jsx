import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import API from '../Services/api';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const MAROON = "#4A0404";
  const GOLD = "#D4AF37";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large! Please select under 5MB.");
        return;
      }
      setMediaFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
        return alert("Please fill in both title and description.");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    if (mediaFile) {
      formData.append('media', mediaFile);
    }

    try {
      const response = await API.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert("Idea submitted successfully! Waiting for admin approval.");
        navigate('/'); 
      }
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong while posting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] py-6 px-4">
      <div className="max-w-2xl mx-auto mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 group transition-all"
        >
          <div className="p-2 rounded-full group-hover:bg-white shadow-sm transition-all border border-transparent group-hover:border-gray-200">
            <ArrowLeft size={20} style={{ color: MAROON }} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: MAROON }}>
            Go Back
          </span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-8 bg-white rounded-[1.5rem] shadow-xl border border-[#E3D9CC]">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: MAROON }}>
              <ImageIcon size={20} style={{ color: GOLD }} />
           </div>
           <h2 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: MAROON }}>
             Share an <span className="text-gray-400">Idea</span>
           </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            placeholder="What's your innovation title?" 
            className="w-full p-4 bg-[#FAF7F2] border border-[#E3D9CC] rounded-xl outline-none focus:ring-1 focus:ring-[#4A0404] font-bold text-[#2B2B2B] placeholder:font-normal placeholder:italic" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />

          <textarea 
            placeholder="Describe your innovation in detail..." 
            className="w-full p-4 h-40 bg-[#FAF7F2] border border-[#E3D9CC] rounded-xl outline-none focus:ring-1 focus:ring-[#4A0404] font-medium resize-none text-[#3F3F3F] placeholder:font-normal placeholder:italic" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />

          {preview && (
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#E3D9CC] shadow-inner">
              <button 
                type="button"
                onClick={() => {setPreview(null); setMediaFile(null);}} 
                className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full text-[#4A0404] hover:bg-[#4A0404] hover:text-white transition-colors z-10 shadow-md"
              >
                <X size={16}/>
              </button>
              <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-white border-2 px-5 py-3 rounded-xl hover:bg-gray-50 transition font-bold text-xs uppercase tracking-widest shadow-sm" style={{ color: MAROON, borderColor: '#E3D9CC' }}>
              <ImageIcon size={16} /> 
              <span>{mediaFile ? "Change Image" : "Attach Visual"}</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </label>
            
            <p className="text-[10px] font-bold text-gray-400 uppercase">Max size: 5MB</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="text-white font-black py-4 rounded-xl w-full transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
            style={{ 
              backgroundColor: loading ? '#D8CFC4' : MAROON,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Publishing...
              </>
            ) : "Post Idea"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;