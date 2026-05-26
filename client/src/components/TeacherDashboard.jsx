import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, FileText, User, GraduationCap, Link2, MapPin, Loader2, X, Download, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Papa from 'papaparse';
import api from '../api';

const SERVER_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

const TeacherDashboard = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [historyActivities, setHistoryActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [allStudents, setAllStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [feedback, setFeedback] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingCertificate, setViewingCertificate] = useState(null);

  useEffect(() => {
    fetchPendingActivities();
    fetchHistoryActivities();
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const { data } = await api.get('/auth/students');
      setAllStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const exportToCSV = () => {
    const csvData = allStudents.map(s => ({
      Name: s.name,
      USN: s.usn,
      Email: s.email,
      Department: s.department || 'N/A',
      Semester: s.semester || 'N/A',
      TotalPoints: s.totalPoints
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_points_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchPendingActivities = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/activities/pending');
      setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryActivities = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await api.get('/activities/history');
      setHistoryActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const response = await api.put(`/activities/${id}/status`, {
        status,
        teacherFeedback: feedback[id] || ''
      });
      const activityToMove = activities.find(a => a._id === id);
      
      // Alert the user
      if (activityToMove) {
        alert(`Your activity "${activityToMove.title}" was ${status.toLowerCase()}`);
      }

      setActivities(activities.filter(a => a._id !== id));
      if (activityToMove) {
        setHistoryActivities([{...activityToMove, status, teacherFeedback: feedback[id] || ''}, ...historyActivities]);
      }
      const newFeedback = { ...feedback };
      delete newFeedback[id];
      setFeedback(newFeedback);
    } catch (err) {
      console.error(err);
      alert(`Error updating activity: ${err.response?.data?.message || err.message}`);
    }
  };

  const currentActivities = activeTab === 'pending' ? activities : historyActivities;
  const currentLoading = activeTab === 'pending' ? loading : historyLoading;

  const filteredActivities = currentActivities.filter(a => 
    a.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.studentId?.usn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header & Stats */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Teacher Dashboard</h1>
          <p className="text-slate-400 text-lg max-w-2xl">Review and manage AICTE Activity points requests and view your history.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-4 rounded-2xl border-primary/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white leading-none">{activities.length}</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Pending Requests</div>
            </div>
          </div>
          <div className="glass-panel px-6 py-4 rounded-2xl border-emerald-500/30 flex items-center gap-4 hidden sm:flex">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white leading-none">{historyActivities.length}</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Reviewed</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 -mb-4">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${activeTab === 'pending' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
        >
          Pending Requests
          {activeTab === 'pending' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${activeTab === 'history' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
        >
          History
          {activeTab === 'history' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${activeTab === 'analytics' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
        >
          Reports & Analytics
          {activeTab === 'analytics' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Toolbar */}
      {activeTab !== 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by student name, USN, or activity..." 
              className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      {activeTab === 'analytics' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-black/20 p-6 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Student Performance Report</h2>
              <p className="text-slate-400 text-sm">Overview of points awarded to students.</p>
            </div>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <Download size={18} /> Export CSV
            </button>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><PieChartIcon className="text-primary"/> Total Points Distribution</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allStudents.slice(0, 20)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                  <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="totalPoints" name="Total Points" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      ) : currentLoading ? (
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
                <Loader2 className="text-primary/50 animate-pulse" size={24} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-1">Loading Data</h3>
              <p className="text-sm text-slate-400">Please wait while we fetch pending requests...</p>
            </div>
          </motion.div>
        </div>
      ) : filteredActivities.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-16 rounded-3xl text-center border-dashed border-slate-700 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center text-emerald-400 mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{activeTab === 'pending' ? 'Inbox Zero!' : 'No History Found'}</h2>
          <p className="text-slate-400">{activeTab === 'pending' ? 'You have no pending activities to review. Great job!' : 'You have not reviewed any activities yet.'}</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredActivities.map((activity, idx) => (
              <motion.div 
                key={activity._id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="glass-panel rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-black/20 flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin size={14} className="text-primary" /> {activity.where}
                    </div>
                  </div>
                  <div className="text-center px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                    <span className="block text-2xl font-black text-primary">{activity.pointsRequested}</span>
                    <span className="text-[10px] uppercase font-bold text-primary/70 tracking-wider">Points</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-grow flex flex-col gap-6">
                  {/* Student Info */}
                  <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-lg">
                      {activity.studentId?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        {activity.studentId?.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1"><GraduationCap size={12}/> {activity.studentId?.usn || 'N/A'}</span>
                        <span className="flex items-center gap-1"><User size={12}/> {activity.studentId?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 block">Activity Description</span>
                    <p className="text-sm text-slate-300 leading-relaxed bg-black/20 p-4 rounded-xl">{activity.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto space-y-4 pt-4 border-t border-slate-800">
                    {activity.certificate && (
                      <button 
                        onClick={() => setViewingCertificate(activity.certificate)}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
                      >
                        <Link2 size={16} className="text-primary" /> View Uploaded Certificate
                      </button>
                    )}

                    {activeTab === 'pending' ? (
                      <>
                        <input 
                          type="text" 
                          placeholder="Add feedback notes (optional)..." 
                          className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600"
                          value={feedback[activity._id] || ''}
                          onChange={(e) => setFeedback({...feedback, [activity._id]: e.target.value})}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => handleAction(activity._id, 'Rejected')} 
                            className="py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border border-red-500/20 transition-colors"
                          >
                            <XCircle size={18} /> Reject
                          </button>
                          <button 
                            onClick={() => handleAction(activity._id, 'Approved')} 
                            className="py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors"
                          >
                            <CheckCircle size={18} /> Approve
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={`p-4 rounded-xl border flex flex-col gap-2 ${activity.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        <div className="flex items-center gap-2 font-bold">
                          {activity.status === 'Approved' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                          Status: {activity.status}
                        </div>
                        {activity.teacherFeedback && (
                          <div className="text-sm text-slate-300 italic">
                            Feedback: {activity.teacherFeedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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
                    src={`${SERVER_URL}/${viewingCertificate}`} 
                    className="w-full h-full rounded-xl bg-white"
                    title="Certificate PDF"
                  />
                ) : (
                  <img 
                    src={`${SERVER_URL}/${viewingCertificate}`} 
                    alt="Certificate" 
                    className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;
