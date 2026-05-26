import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, Clock, XCircle, Award, FileText, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api';

const StudentDashboard = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({ title: '', where: '', description: '', pointsRequested: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a certificate PDF/Image');

    setIsUploading(true);
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('where', formData.where);
    submitData.append('description', formData.description);
    submitData.append('pointsRequested', formData.pointsRequested);
    submitData.append('certificate', file);

    try {
      await api.post('/activities', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ title: '', where: '', description: '', pointsRequested: '' });
      setFile(null);
      fetchActivities(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Error submitting activity');
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate Stats
  const approvedPoints = activities.filter(a => a.status === 'Approved').reduce((sum, a) => sum + a.pointsRequested, 0);
  const pendingPoints = activities.filter(a => a.status === 'Pending').reduce((sum, a) => sum + a.pointsRequested, 0);
  const rejectedPoints = activities.filter(a => a.status === 'Rejected').reduce((sum, a) => sum + a.pointsRequested, 0);
  const totalGoal = 100;
  const progressPercentage = Math.min((approvedPoints / totalGoal) * 100, 100);

  const chartData = [
    { name: 'Approved', value: approvedPoints, color: '#10b981' },
    { name: 'Pending', value: pendingPoints, color: '#f59e0b' },
    { name: 'Remaining', value: Math.max(totalGoal - approvedPoints - pendingPoints, 0), color: '#1e293b' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* LEFT SIDEBAR: PROFILE & STATS */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0"
      >
        {/* Profile Card */}
        <div className="glass-panel rounded-2xl p-8 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-50" />
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-primary to-purple-500 p-1 shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-4">
              <div className="w-full h-full bg-bg-dark rounded-full flex items-center justify-center text-3xl font-bold text-white">
                {user?.name.charAt(0)}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 font-medium">
              <Award size={14} className="text-primary" /> USN: {user?.usn || 'N/A'}
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <Award className="text-primary" /> Point Tracker
          </h3>
          
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-2">
              <div className="text-4xl font-black text-white">{approvedPoints}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Points</div>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Approved</span>
              <span className="font-bold text-white">{approvedPoints} pts</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending</span>
              <span className="font-bold text-white">{pendingPoints} pts</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: MAIN CONTENT */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Submissions', value: activities.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Approved', value: activities.filter(a => a.status === 'Approved').length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { label: 'Pending', value: activities.filter(a => a.status === 'Pending').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { label: 'Rejected', value: activities.filter(a => a.status === 'Rejected').length, icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel rounded-2xl p-5 flex flex-col">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Upload New Activity Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Submit New Certificate</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Activity Name</label>
                <input type="text" required placeholder="e.g. Smart India Hackathon" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Location / Platform</label>
                <input type="text" required placeholder="e.g. AICTE Portal, Coursera" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600" value={formData.where} onChange={e => setFormData({...formData, where: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Points Requested</label>
                <input type="number" required min="1" placeholder="e.g. 10" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600" value={formData.pointsRequested} onChange={e => setFormData({...formData, pointsRequested: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <input type="text" required placeholder="Brief summary of what you did" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('certFile').click()}>
              <div className={`absolute inset-0 bg-primary/5 rounded-2xl border-2 border-dashed transition-colors ${file ? 'border-primary' : 'border-slate-700 group-hover:border-primary/50'}`} />
              <div className="relative p-10 flex flex-col items-center justify-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${file ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
                  {file ? <CheckCircle size={32} /> : <UploadCloud size={32} />}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{file ? file.name : 'Upload Certificate'}</h3>
                <p className="text-sm text-slate-400">{file ? 'Ready to submit' : 'Drag and drop or click to browse (PDF, PNG, JPG)'}</p>
                <input id="certFile" type="file" accept=".pdf, image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={isUploading} className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-50">
                {isUploading ? 'Uploading...' : 'Submit Request'} <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </motion.div>

        {/* Activity History Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Recent Submissions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/40 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Activity</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Points</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {activities.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No activities submitted yet.</td></tr>
                ) : (
                  activities.map((a) => (
                    <tr key={a._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{a.title}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px]">{a.description}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{a.where}</td>
                      <td className="px-6 py-4 font-bold text-white">{a.pointsRequested}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          a.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          a.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {a.status === 'Approved' && <CheckCircle size={12} />}
                          {a.status === 'Rejected' && <XCircle size={12} />}
                          {a.status === 'Pending' && <Clock size={12} />}
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default StudentDashboard;
