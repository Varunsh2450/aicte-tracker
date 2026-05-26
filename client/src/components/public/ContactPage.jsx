import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 bg-bg-dark">
      
      {/* Left Info */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8">
        <div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Get in Touch.</h1>
          <p className="text-xl text-slate-400 max-w-md">Have questions about integrating AICTE Tracker into your institution? Our team is here to help.</p>
        </div>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary"><Mail size={20} /></div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Us</div>
              <div className="font-medium text-lg">support@aicte-tracker.edu</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary"><Phone size={20} /></div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Call Us</div>
              <div className="font-medium text-lg">+91 800 123 4567</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary"><MapPin size={20} /></div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Headquarters</div>
              <div className="font-medium text-lg">Bangalore, Karnataka</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Form */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
        <div className="glass-panel rounded-3xl p-8 shadow-2xl">
          <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); alert("Message Sent Successfully!"); }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">First Name</label>
                <input type="text" required className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Last Name</label>
                <input type="text" required className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input type="email" required className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Message</label>
              <textarea required rows="4" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"></textarea>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
