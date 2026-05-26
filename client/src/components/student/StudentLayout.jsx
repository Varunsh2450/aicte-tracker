import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileUp, History, LogOut, Award, Trophy, GraduationCap, Settings } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api';

const StudentLayout = ({ user, setAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/auth/me');
        const unread = data.notifications?.filter(n => !n.read) || [];
        
        if (unread.length > 0) {
          // Display each unread notification
          unread.forEach(notif => {
            if (notif.type === 'success') {
              toast.success(notif.message, { duration: 6000 });
            } else if (notif.type === 'error') {
              toast.error(notif.message, { duration: 6000 });
            } else {
              toast(notif.message, { duration: 6000 });
            }
          });
          
          // Mark as read in the backend
          await api.put('/auth/notifications/read');
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    // Initial check
    fetchNotifications();

    // Poll every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Overview', path: '/student', icon: LayoutDashboard },
    { name: 'Submit Activity', path: '/student/submit', icon: FileUp },
    { name: 'My History', path: '/student/history', icon: History },
    { name: 'Leaderboard', path: '/student/leaderboard', icon: Trophy },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-dark flex">
      <Toaster 
        position="top-center" 
        containerStyle={{
          top: 40,
        }}
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 30, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
            borderRadius: '16px',
            padding: '16px 24px',
            fontSize: '15px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-panel border-y-0 border-l-0 rounded-none fixed h-full flex flex-col z-40 bg-black/50">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white mb-8">
            <GraduationCap className="text-primary" />
            AICTE<span className="font-light text-slate-400">Tracker</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border-primary/20 bg-primary/5 mb-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-primary to-purple-500 p-0.5 mb-2">
              <div className="w-full h-full bg-bg-dark rounded-full flex items-center justify-center text-xl font-bold text-white">
                {user?.name.charAt(0)}
              </div>
            </div>
            <div className="font-bold text-white text-sm truncate">{user?.name}</div>
            <div className="text-xs text-slate-400">{user?.usn || 'Student'}</div>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/student'}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <link.icon size={18} />
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 relative min-h-screen">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
