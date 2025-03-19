import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

import Sidebar from './component/sidebar';
import EventSection from './component/eventsection';
import Dashboard from './component/dashboard';
import Profiles from './component/profiles';
import Users from './component/user';
import Guide from './component/guide';
import Login from './component/login';
import Signup from './component/signup';
import Eventdetail from './component/eventdetail';
import ProfileDashboard from './component/profiledashboard';
import Publiceventdetail from './component/publiceventdetail';
import CalendarTab from './component/CalendarTab'; 
import ChatBox from './component/ChatBox'; // Added for chat functionality

const AppContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Added to store decoded user data
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Invalid token:', e);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } else {
      setIsAuthenticated(false);
      setUser(null); // Clear user if no token
    }
    console.log('Path:', location.pathname, 'Authenticated:', isAuthenticated, 'User:', user);
  }, [location.pathname]); // Removed isAuthenticated from deps to avoid infinite loop

  return (
    <div className="flex">
      {isAuthenticated && !isAuthPage && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      )}
      <div
        className={`flex-1 p-2 h-screen transition-all duration-200 ${
          isAuthenticated && !isAuthPage ? (isSidebarCollapsed ? 'ml-18' : 'ml-60') : ''
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
          {/* Auth Routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/event" element={<EventSection />} />
              <Route path="/event/:id" element={<Eventdetail />} />
              <Route path="/publicevent/:id" element={<Publiceventdetail />} />
              <Route path="/calendar" element={<CalendarTab />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/users" element={<Users />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/profile-dashboard" element={<ProfileDashboard />} />
              <Route path="/chat" element={<ChatBox userId={user?.id} role={user?.role} />} /> {/* Added Chat */}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;