import React, { useEffect, useState } from 'react';
import API from '../Services/api';
import { FileText, CheckCircle, Clock } from 'lucide-react';

const StatsCard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const name = localStorage.getItem('name') || 'Innovator';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/posts/my-stats');
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-20">
      <div className="h-16 bg-blue-600"></div>
      <div className="px-5 pb-6 -mt-8">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg mx-auto mb-3 flex items-center justify-center text-2xl font-black text-blue-700 border-4 border-white">
          {name[0].toUpperCase()}
        </div>
        <h3 className="text-center font-bold text-slate-800">Hi, {name}!</h3>
        
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-xs font-bold">
            <span className="flex items-center gap-2 text-slate-500"><FileText size={14}/> My Posts</span>
            <span className="text-blue-600">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl text-xs font-bold">
            <span className="flex items-center gap-2 text-green-600"><CheckCircle size={14}/> Approved</span>
            <span>{stats.approved}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl text-xs font-bold">
            <span className="flex items-center gap-2 text-orange-600"><Clock size={14}/> Pending</span>
            <span>{stats.pending}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;