import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, XCircle, History as HistoryIcon, Link2, FileText, X, Trash2 } from 'lucide-react';
import api from '../../api';

const StudentHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingCertificate, setViewingCertificate] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get('/activities/my');
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pending request?')) return;
    
    try {
      await api.delete(`/activities/${id}`);
      setActivities(activities.filter(a => a._id !== id));
    } catch (error) {
      console.error('Failed to delete activity:', error);
      alert(error.response?.data?.message || 'Failed to delete activity');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-8 rounded-2xl flex flex-col items-center gap-4 max-w-sm w-full mx-4 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-lg"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <HistoryIcon className="text-primary/50 animate-pulse" size={24} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-1">Loading Data</h3>
            <p className="text-sm text-slate-400">Please wait while we fetch your history...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-primary/20 text-primary rounded-xl"><HistoryIcon size={24}/></div>
            Activity History
          </h1>
          <p className="text-slate-400">View the status and feedback for all your past submissions.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/40 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-5 font-medium">Activity Details</th>
                <th className="px-6 py-5 font-medium">Location</th>
                <th className="px-6 py-5 font-medium">Points</th>
                <th className="px-6 py-5 font-medium">Status</th>
                <th className="px-6 py-5 font-medium">Feedback</th>
                <th className="px-6 py-5 font-medium">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {activities.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No activities submitted yet.</td></tr>
              ) : (
                activities.map((a) => (
                  <tr key={a._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-base">{a.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{new Date(a.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-5 text-slate-300">{a.where}</td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-lg">{a.pointsRequested}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                        a.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                        a.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {a.status === 'Approved' && <CheckCircle size={14} />}
                        {a.status === 'Rejected' && <XCircle size={14} />}
                        {a.status === 'Pending' && <Clock size={14} />}
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-400 max-w-[200px] truncate">
                      {a.teacherFeedback ? `"${a.teacherFeedback}"` : <span className="opacity-50">-</span>}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setViewingCertificate(a.certificate)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-primary hover:text-white transition-colors text-slate-300 font-medium border border-slate-700 hover:border-primary"
                        >
                          <Link2 size={14} /> View
                        </button>
                        {a.status === 'Pending' && (
                          <button
                            onClick={() => handleDelete(a._id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors text-red-400 border border-red-500/20 hover:border-red-500"
                            title="Delete Request"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Viewer Lightbox */}
      <AnimatePresence>
        {viewingCertificate && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewingCertificate(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl h-[85vh] glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()} // Prevent click from closing when clicking inside
            >
              <div className="flex justify-between items-center p-4 bg-black/40 border-b border-slate-800">
                <h3 className="text-white font-bold flex items-center gap-2"><FileText size={18} className="text-primary"/> Certificate Viewer</h3>
                <button 
                  onClick={() => setViewingCertificate(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 bg-black/50 p-4 flex justify-center items-center overflow-auto relative">
                {viewingCertificate.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={`http://localhost:5000/${viewingCertificate}`} 
                    className="w-full h-full rounded-xl bg-white"
                    title="Certificate PDF"
                  />
                ) : (
                  <img 
                    src={`http://localhost:5000/${viewingCertificate}`} 
                    alt="Certificate" 
                    className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentHistory;
