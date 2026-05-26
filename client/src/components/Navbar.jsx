import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
    navigate('/');
  };

  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['home', 'features', 'how-it-works', 'faq', 'contact'];
      const scrollPosition = window.scrollY + 300; 

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-x-0 rounded-none bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand */}
        <div onClick={() => scrollTo('home')} className="flex items-center gap-2 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 180 }} 
            transition={{ duration: 0.5 }}
            className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <GraduationCap size={24} />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            AICTE<span className="font-light text-slate-400">Tracker</span>
          </span>
        </div>
        
        {/* Navigation Links for Public Visitors */}
        {!user && (
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 relative">
            {['home', 'features', 'how-it-works', 'faq', 'contact'].map((section) => (
              <button 
                key={section}
                onClick={() => scrollTo(section)}
                className={`relative text-sm font-medium transition-colors capitalize z-10 px-4 py-1.5 rounded-full ${activeSection === section ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {activeSection === section && (
                  <motion.div 
                    layoutId="navPill" 
                    className="absolute inset-0 bg-primary/30 rounded-full -z-10 border border-primary/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {t(`nav.${section}`)}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.role}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 cursor-pointer" onClick={() => navigate(`/${user.role.toLowerCase()}`)}>
                  {user.name.charAt(0)}
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors text-sm text-slate-300"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                >
                  <Globe size={16} className="text-primary" />
                  <span className="uppercase">{i18n.language}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 glass-panel border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl py-1 z-50">
                    {['en', 'hi', 'kn'].map((lng) => (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === lng ? 'bg-primary/20 text-white font-bold' : 'text-slate-300 hover:bg-white/10'}`}
                      >
                        {lng === 'en' ? 'English' : lng === 'hi' ? 'हिंदी' : 'ಕನ್ನಡ'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/login?type=student" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('nav.login')}</Link>
              <Link to="/login?type=student" className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {t('nav.getStarted')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
