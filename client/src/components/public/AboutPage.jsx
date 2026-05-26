import { motion } from 'framer-motion';
import { Target, Users, BookOpen } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto bg-bg-dark">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Revolutionizing <br/><span className="text-primary">Academic Tracking</span></h1>
        <p className="text-xl text-slate-400">Our mission is to bridge the gap between institutional requirements and student achievements through seamless, real-time software.</p>
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-8 rounded-3xl text-center">
          <div className="w-16 h-16 mx-auto bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6"><Target size={32} /></div>
          <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
          <p className="text-slate-400 text-sm leading-relaxed">To completely eliminate paper-based tracking in universities across the country by providing a unified digital workspace.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 rounded-3xl text-center">
          <div className="w-16 h-16 mx-auto bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6"><Users size={32} /></div>
          <h3 className="text-xl font-bold text-white mb-4">For Students</h3>
          <p className="text-slate-400 text-sm leading-relaxed">We empower students to easily upload certificates, track their 100-point AICTE requirement, and visually monitor their progress.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-8 rounded-3xl text-center">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6"><BookOpen size={32} /></div>
          <h3 className="text-xl font-bold text-white mb-4">For Institutions</h3>
          <p className="text-slate-400 text-sm leading-relaxed">We provide faculty and admins with a dashboard to instantly review, approve, and verify student extracurricular activities securely.</p>
        </motion.div>
      </div>

    </div>
  );
};

export default AboutPage;
