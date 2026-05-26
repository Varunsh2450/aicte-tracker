import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';

// Student Pages
import StudentLayout from './components/student/StudentLayout';
import StudentOverview from './components/student/StudentOverview';
import StudentSubmit from './components/student/StudentSubmit';
import StudentHistory from './components/student/StudentHistory';
import StudentLeaderboard from './components/student/StudentLeaderboard';
import StudentSettings from './components/student/StudentSettings';

// Teacher Pages
import TeacherDashboard from './components/TeacherDashboard';

// Admin Pages
import AdminDashboard from './components/AdminDashboard';

import './index.css';

function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setAuth(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<><Navbar user={auth} setAuth={setAuth} /><LandingPage /></>} />
        
        {/* Auth Route */}
        <Route 
          path="/login" 
          element={
            <>
              <Navbar user={auth} setAuth={setAuth} />
              {!auth ? <Login setAuth={setAuth} /> : <Navigate to={auth.role === 'Student' ? "/student" : auth.role === 'Teacher' ? "/teacher" : "/admin"} />}
            </>
          } 
        />
        
        {/* Student Multipage Dashboard Routes */}
        <Route 
          path="/student" 
          element={
            auth && auth.role === 'Student' ? 
            <StudentLayout user={auth} setAuth={setAuth} /> : 
            <Navigate to="/login" />
          } 
        >
          <Route index element={<StudentOverview />} />
          <Route path="submit" element={<StudentSubmit />} />
          <Route path="history" element={<StudentHistory />} />
          <Route path="leaderboard" element={<StudentLeaderboard />} />
          <Route path="settings" element={<StudentSettings user={auth} setAuth={setAuth} />} />
        </Route>

        {/* Teacher Dashboard */}
        <Route 
          path="/teacher" 
          element={
            <>
              <Navbar user={auth} setAuth={setAuth} />
              {auth && auth.role === 'Teacher' ? 
                <TeacherDashboard user={auth} /> : 
                <Navigate to="/login" />
              }
            </>
          } 
        />

        {/* Admin Dashboard */}
        <Route 
          path="/admin" 
          element={
            <>
              <Navbar user={auth} setAuth={setAuth} />
              {auth && auth.role === 'Admin' ? 
                <AdminDashboard user={auth} setAuth={setAuth} /> : 
                <Navigate to="/login" />
              }
            </>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
