import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Shield, Save } from 'lucide-react';
import api from '../../api';

const StudentSettings = ({ user, setAuth }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    department: user?.department || '',
    semester: user?.semester || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const { data } = await api.put('/auth/profile', formData);
      setAuth(data);
      localStorage.setItem('user', JSON.stringify(data));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error updating profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-primary/20 text-primary rounded-xl"><User size={24}/></div>
          Account Settings
        </h1>
        <p className="text-slate-400">Manage your profile, department details, and security.</p>
      </div>

      <div className="glass-panel rounded-2xl p-8 shadow-2xl">
        {message.text && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-semibold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.type === 'success' ? <Shield size={18} /> : <Lock size={18} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ISE">ISE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => <option key={sem} value={sem}>{sem} Semester</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Security</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">New Password (leave blank to keep current)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter new password" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="mt-4 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default StudentSettings;
