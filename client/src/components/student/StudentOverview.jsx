import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, Flame } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../api';

// Animation variants for stagger effects
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const StudentOverview = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedApproved, setAnimatedApproved] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    // Fallback timeout in case the backend completely hangs
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
        console.warn("Backend request timed out. Forcing loading to finish.");
      }
    }, 8000);

    const fetchActivities = async () => {
      try {
        const { data } = await api.get('/activities/my', { timeout: 7000 });
        if (isMounted) setActivities(data);
      } catch (err) {
        console.error("Error fetching activities:", err);
      } finally {
        if (isMounted) setLoading(false);
        clearTimeout(timeoutId);
      }
    };
    
    fetchActivities();
    
    return () => { isMounted = false; clearTimeout(timeoutId); };
  }, []);

  const approvedPoints = activities.filter(a => a.status === 'Approved').reduce((sum, a) => sum + a.pointsRequested, 0);
  const pendingPoints = activities.filter(a => a.status === 'Pending').reduce((sum, a) => sum + a.pointsRequested, 0);
  const totalGoal = 100;

  // Animate the number counting up
  useEffect(() => {
    if (!loading && approvedPoints > 0) {
      let current = 0;
      const step = Math.max(1, Math.floor(approvedPoints / 30));
      const interval = setInterval(() => {
        current += step;
        if (current >= approvedPoints) {
          setAnimatedApproved(approvedPoints);
          clearInterval(interval);
        } else {
          setAnimatedApproved(current);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
        setAnimatedApproved(approvedPoints);
    }
  }, [loading, approvedPoints]);

  const chartData = [
    { name: 'Approved', value: approvedPoints, color: '#10b981' },
    { name: 'Pending', value: pendingPoints, color: '#f59e0b' },
    { name: 'Remaining', value: Math.max(totalGoal - approvedPoints - pendingPoints, 0), color: 'rgba(255, 255, 255, 0.05)' }
  ];

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 font-medium">Track your progress towards the 100-point AICTE mandate.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden group">
          {loading ? (
            <div className="absolute inset-0 skeleton z-20"></div>
          ) : null}
          
          <div className="absolute top-0 right-0 p-6 opacity-5 transition-opacity duration-500 group-hover:opacity-10">
            <Target size={120} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">Point Completion Tracker</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
            <div className="w-[220px] h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={chartData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={80} 
                    outerRadius={100} 
                    paddingAngle={6} 
                    dataKey="value" 
                    stroke="none"
                    cornerRadius={8}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="transition-all duration-300 hover:opacity-80 cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)', 
                      borderRadius: '12px', 
                      color: '#fff',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    }} 
                    itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-4xl font-black text-white">{animatedApproved}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">/ 100 pts</div>
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} className="glass-panel border-emerald-500/30 bg-emerald-500/10 p-5 rounded-xl flex items-center justify-between shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                <div>
                  <div className="text-xs text-emerald-200/70 font-semibold uppercase tracking-wider mb-1">Approved</div>
                  <div className="text-2xl font-bold text-emerald-400">{approvedPoints} pts</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="text-emerald-400" size={24} />
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="glass-panel border-amber-500/30 bg-amber-500/10 p-5 rounded-xl flex items-center justify-between shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]">
                <div>
                  <div className="text-xs text-amber-200/70 font-semibold uppercase tracking-wider mb-1">Pending Review</div>
                  <div className="text-2xl font-bold text-amber-400">{pendingPoints} pts</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Clock className="text-amber-400" size={24} />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Motivation Card */}
        <motion.div variants={itemVariants} className="glass-panel glass-panel-hover rounded-2xl p-6 bg-gradient-to-br from-primary/20 to-transparent flex flex-col justify-center text-center items-center relative overflow-hidden group">
          {loading ? (
            <div className="absolute inset-0 skeleton z-20"></div>
          ) : null}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-[0_0_40px_rgba(139,92,246,0.4)] transform transition-transform duration-500 group-hover:scale-110">
            <Flame size={40} className="text-primary-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Keep going!</h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-[200px]">
            You need <strong className="text-white font-bold">{Math.max(100 - approvedPoints, 0)}</strong> more points to complete your degree requirement.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentOverview;
