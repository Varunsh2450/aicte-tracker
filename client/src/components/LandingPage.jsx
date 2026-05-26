import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Cloud, Mail, Phone, MapPin, Send, Target, Users, BookOpen, CheckCircle, Clock, ChevronDown, CheckSquare, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-bg-dark flex flex-col">
      {/* HOME SECTION */}
      <section id="home" className="min-h-screen relative flex items-center overflow-hidden pt-20">
        
        {/* Trust & Growth Animated Background Mesh & Grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[5%] left-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/30 blur-[100px] md:blur-[130px] rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[30%] right-[5%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-emerald-600/20 blur-[100px] md:blur-[140px] rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] left-[20%] w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-indigo-600/20 blur-[120px] md:blur-[150px] rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.4, 1], x: [0, -40, 0], y: [0, -40, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[20%] left-[40%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-600/20 blur-[90px] md:blur-[120px] rounded-full"
          />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="text-left pt-10 lg:pt-0">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-white tracking-tight mb-4 md:mb-6 leading-tight">
              {t('landing.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-[length:200%_auto] animate-text-gradient block pb-1">{t('landing.title2')}</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
              {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link to="/login?type=student" className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2">
                👨‍🎓 {t('landing.startJourney')} <span className="ml-1">→</span>
              </Link>
              <Link to="/login?type=teacher" className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all flex items-center justify-center gap-2">
                👩‍🏫 {t('landing.viewDemo')}
              </Link>
            </div>
          </motion.div>

          {/* Floating Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center relative w-full"
          >
            <motion.div 
              animate={{ y: [-10, 10] }} 
              transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
              className="relative z-10 w-full max-w-[480px] xl:max-w-[550px]"
              style={{ perspective: "1200px" }}
            >
              <motion.div 
                initial={{ rotateY: -15, rotateX: 5 }}
                animate={{ rotateY: -15, rotateX: 5 }}
                className="w-full bg-[#0f172a]/80 backdrop-blur-2xl rounded-2xl p-5 md:p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10"
              >
                {/* Mockup Header */}
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><Target size={20} /></div>
                    <div>
                      <div className="h-3 md:h-4 w-24 md:w-32 bg-white/80 rounded mb-2"></div>
                      <div className="h-2 md:h-3 w-16 md:w-20 bg-slate-400 rounded"></div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] md:text-xs font-bold border border-emerald-500/20 whitespace-nowrap">100 / 100 PTS</div>
                </div>
                
                {/* Mockup Chart Area */}
                <div className="flex gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[8px] md:border-[12px] border-emerald-500/80 flex items-center justify-center shrink-0">
                     <span className="text-xl md:text-3xl font-black text-white">100</span>
                  </div>
                  <div className="flex-1 space-y-3 md:space-y-4 flex flex-col justify-center">
                     <div className="h-12 md:h-14 w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center px-3 md:px-4 gap-2 md:gap-3">
                       <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                       <div className="h-2.5 w-full max-w-[100px] bg-emerald-400/50 rounded"></div>
                     </div>
                     <div className="h-12 md:h-14 w-full rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center px-3 md:px-4 gap-2 md:gap-3">
                       <Clock size={18} className="text-amber-500/50 shrink-0" />
                       <div className="h-2.5 w-full max-w-[70px] bg-amber-500/30 rounded"></div>
                     </div>
                  </div>
                </div>

                {/* Mockup List */}
                <div className="space-y-2 md:space-y-3">
                   <div className="h-8 md:h-10 w-full rounded-lg bg-white/5 border border-white/5"></div>
                   <div className="h-8 md:h-10 w-full rounded-lg bg-white/5 border border-white/5 opacity-70"></div>
                </div>
              </motion.div>
              
              {/* Floating Mini Card */}
              <motion.div 
                animate={{ y: [8, -8] }} 
                transition={{ repeat: Infinity, duration: 3, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-6 md:-bottom-6 md:-left-12 bg-[#0f172a]/90 backdrop-blur-md p-3 md:p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 scale-90 md:scale-100"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <div className="text-[10px] md:text-xs text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Activity Approved</div>
                  <div className="text-base md:text-xl font-black text-white">+20 Points</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* IMPACT STATS BANNER */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto w-full border-y border-white/5 bg-black/20 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10,000+", label: "Certificates Verified" },
            { value: "50+", label: "Partner Institutions" },
            { value: "100%", label: "Paperless Workflows" },
            { value: "24/7", label: "Automated Tracking" }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-3xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-xs md:text-sm text-blue-400 font-bold tracking-wider uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="min-h-screen relative flex flex-col justify-center py-20 px-6 max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">{t('landing.featuresTitle')}</h2>
          <p className="text-xl text-slate-400">Our mission is to bridge the gap between institutional requirements and student achievements through seamless, real-time software.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: 'Our Vision', desc: 'To completely eliminate paper-based tracking in universities by providing a unified digital workspace.', color: 'text-blue-400', bg: 'bg-blue-500/20' },
            { icon: Users, title: 'For Students', desc: 'Empowering students to easily upload certificates, track their 100-point AICTE requirement, and visually monitor progress.', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
            { icon: BookOpen, title: 'For Institutions', desc: 'Providing faculty and admins with a dashboard to instantly review, approve, and verify student activities securely.', color: 'text-cyan-400', bg: 'bg-cyan-500/20' }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-panel p-8 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className={`w-16 h-16 mx-auto ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}><item.icon size={32} /></div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="min-h-screen relative flex flex-col justify-center py-20 px-6 max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">{t('landing.howItWorksTitle')}.</h2>
          <p className="text-xl text-slate-400">A seamless, three-step process to track and approve activities.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-emerald-500/0 z-0"></div>
          
          {[
            { step: "01", title: "Attend & Upload", desc: "Students participate in AICTE approved events and upload their certificates or proofs to the portal.", icon: Cloud, color: "text-blue-400" },
            { step: "02", title: "Faculty Review", desc: "Teachers and Admins receive instant notifications to securely review and verify the submitted proofs.", icon: CheckSquare, color: "text-indigo-400" },
            { step: "03", title: "Points Awarded", desc: "Once approved, points are automatically credited to the student's 100-point graduation requirement.", icon: Award, color: "text-emerald-400" }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full glass-panel flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative bg-[#0b1120]">
                <item.icon size={36} className={item.color} />
              </div>
              <div className={`text-6xl font-black ${item.color} opacity-10 absolute -top-4 right-[20%] -z-10`}>{item.step}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed max-w-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="min-h-[80vh] relative flex flex-col justify-center py-20 px-6 max-w-4xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {[
            { q: "What is the 100-point AICTE requirement?", a: "AICTE mandates that students must earn 100 activity points before graduation by participating in various extracurricular, technical, and social initiatives." },
            { q: "How long does verification take?", a: "Once a student uploads a certificate, faculty members are notified immediately. Verification typically takes 1-2 business days depending on the institution." },
            { q: "Who has access to my uploaded certificates?", a: "Only authorized faculty members and institution admins can view and verify your uploaded documents. Your data is encrypted and securely stored." },
            { q: "Can I download a report of my earned points?", a: "Yes! Students can download a comprehensive, verified activity report from their dashboard at any time to submit for graduation." }
          ].map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-panel p-6 rounded-2xl cursor-pointer group hover:bg-white/5 transition-colors">
              <details className="group marker:content-['']">
                <summary className="flex justify-between items-center font-bold text-lg text-white list-none outline-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronDown className="text-slate-400 transition-transform group-open:rotate-180" size={20} />
                </summary>
                <p className="text-slate-400 mt-4 leading-relaxed pl-4 border-l-2 border-blue-500/50">{faq.a}</p>
              </details>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="min-h-screen relative flex items-center py-20 px-6 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="flex flex-col md:flex-row gap-12 w-full">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 space-y-8 flex flex-col justify-center">
            <div>
              <h2 className="text-5xl font-black text-white mb-4 tracking-tight">Get in Touch.</h2>
              <p className="text-xl text-slate-400 max-w-md">Have questions about integrating AICTE Tracker into your institution? Our team is here to help.</p>
            </div>
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary"><Mail size={20} /></div>
                <div><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Us</div><div className="font-medium text-lg text-white">support@aicte-tracker.edu</div></div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary"><Phone size={20} /></div>
                <div><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Call Us</div><div className="font-medium text-lg text-white">+91 800 123 4567</div></div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary"><MapPin size={20} /></div>
                <div><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Headquarters</div><div className="font-medium text-lg text-white">Bangalore, Karnataka</div></div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1">
            <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <form className="flex flex-col gap-6 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Message Sent Successfully!"); }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-sm font-medium text-slate-300">First Name</label><input type="text" required className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Last Name</label><input type="text" required className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" /></div>
                </div>
                <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Email Address</label><input type="email" required className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" /></div>
                <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Message</label><textarea required rows="4" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none outline-none"></textarea></div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">Send Message <Send size={18} /></button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
