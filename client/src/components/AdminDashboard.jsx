import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Clock, Award, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = ({ user, setAuth }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching admin data. Make sure you have Admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-bg-dark flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 rounded-2xl flex flex-col items-center gap-4 max-w-sm w-full mx-4"
        >
          <div className="relative w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="text-center mt-4">
            <h3 className="text-xl font-semibold text-white mb-1">Loading Admin Panel</h3>
            <p className="text-sm text-slate-400">Fetching college-wide statistics...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Teachers', value: stats?.totalTeachers || 0, icon: Shield, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Total Activities', value: stats?.totalActivities || 0, icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Points Awarded', value: stats?.totalPointsAwarded || 0, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Approved Requests', value: stats?.approvedActivities || 0, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Pending Requests', value: stats?.pendingActivities || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' }
  ];

  return (
    <div className="min-h-screen bg-bg-dark pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-bold mb-4">
              <Shield size={16} /> Admin Portal
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">College Overview</h1>
            <p className="text-slate-400 text-lg max-w-2xl">Monitor system usage, student progress, and manage users across the institution.</p>
          </div>
          <button onClick={handleLogout} className="glass-panel px-6 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center gap-2 font-semibold">
            <LogOut size={18} /> Logout
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel rounded-2xl p-5 flex flex-col">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-black/20">
            <h2 className="text-xl font-bold text-white">System Users</h2>
            <div className="text-sm font-medium text-slate-400">Total: {users.length}</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/40 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">USN / Info</th>
                  <th className="px-6 py-4 font-medium">Points</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{u.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${
                          u.role === 'Teacher' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{u.email}</td>
                      <td className="px-6 py-4 text-slate-400">{u.usn || '-'}</td>
                      <td className="px-6 py-4">
                        {u.role === 'Student' ? (
                          <div className="font-bold text-emerald-400">{u.totalPoints || 0} pts</div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
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

export default AdminDashboard;
