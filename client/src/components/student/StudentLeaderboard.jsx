import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';
import api from '../../api';

const StudentLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/auth/leaderboard');
        setLeaderboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-white text-center py-20">Loading leaderboard...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-amber-500/10" />
        <Trophy className="w-16 h-16 text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Global Leaderboard</h1>
        <p className="text-slate-400 max-w-lg">Compete with your peers! Earn AICTE points to climb the ranks and unlock exclusive achievement badges.</p>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="text-primary" size={20} /> Top Performers
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium w-16 text-center">Rank</th>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Badges</th>
                <th className="px-6 py-4 font-medium text-right">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {leaderboard.map((student, index) => (
                <tr key={student._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-center">
                    {index === 0 ? <Medal className="text-yellow-400 mx-auto" size={24} /> :
                     index === 1 ? <Medal className="text-slate-300 mx-auto" size={24} /> :
                     index === 2 ? <Medal className="text-amber-600 mx-auto" size={24} /> :
                     <span className="font-bold text-slate-500 text-lg">#{index + 1}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-base">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.usn}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {student.badges && student.badges.length > 0 ? (
                        student.badges.map((badge, i) => (
                          <div key={i} className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:border-primary transition-colors cursor-pointer" title={badge.name}>
                            <span className="text-lg">{badge.icon}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No badges</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-black text-sm ${index === 0 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                      {student.totalPoints} pts
                    </span>
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No data available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentLeaderboard;
