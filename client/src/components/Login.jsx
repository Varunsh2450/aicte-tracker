import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, GraduationCap, Building, Shield } from 'lucide-react';
import api from '../api';

const Login = ({ setAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultRole = searchParams.get('type') === 'teacher' ? 'Teacher' : 'Student';
  
  const [activeTab, setActiveTab] = useState(defaultRole);
  
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    department: '',
    semester: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password } 
        : { ...formData, role: activeTab };
      
      const { data } = await api.post(endpoint, payload);
      
      // Enforce that the user logs in through their correct role portal
      if (isLogin && data.role !== activeTab) {
        setError(`Access denied. Please use the ${data.role} portal to log in.`);
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setAuth(data);
      
      if (data.role === 'Student') navigate('/student');
      else if (data.role === 'Teacher') navigate('/teacher');
      else navigate('/admin');
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden bg-bg-dark">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel w-full max-w-[450px] p-0 overflow-hidden relative z-10 shadow-2xl shadow-black"
      >
        {/* Role Tabs */}
        <div className="flex border-b border-glass-border bg-black/40 backdrop-blur-xl relative">
          {['Student', 'Teacher', 'Admin'].map((tab) => (
            <button 
              key={tab}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {tab === 'Student' ? <GraduationCap size={18} /> : tab === 'Teacher' ? <Building size={18} /> : <Shield size={18} />}
                {tab}
              </span>
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-slate-400">
              {isLogin ? `Sign in to your ${activeTab} dashboard` : `Join the platform as a ${activeTab}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full bg-black/30 border border-slate-700/50 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!isLogin && activeTab === 'Student' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">ID</div>
                  <input
                    type="text"
                    name="usn"
                    placeholder="USN (e.g., 1RV21CS001)"
                    className="w-full bg-black/30 border border-slate-700/50 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 mb-4"
                    value={formData.usn}
                    onChange={handleChange}
                    required
                  />
                  <div className="flex gap-4">
                    <select
                      name="department"
                      className="w-1/2 bg-black/30 border border-slate-700/50 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled className="text-slate-500">Department</option>
                      <option value="CSE">CSE</option>
                      <option value="ISE">ISE</option>
                      <option value="ECE">ECE</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                    </select>
                    <select
                      name="semester"
                      className="w-1/2 bg-black/30 border border-slate-700/50 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled className="text-slate-500">Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>{sem} Semester</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full bg-black/30 border border-slate-700/50 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full bg-black/30 border border-slate-700/50 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="text-primary font-semibold hover:text-white transition-colors" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
