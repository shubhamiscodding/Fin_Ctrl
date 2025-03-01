import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
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

// This component will be inside Router context
const AppContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Check if token exists
  );
  
  const location = useLocation();
  // Check if current path is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex">
      {isAuthenticated && !isAuthPage && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
      )}

      <div 
        className={`flex-1 p-2 transition-all duration-200 ${
          isAuthenticated && !isAuthPage ? (isSidebarCollapsed ? "ml-18" : "ml-60") : ""
        }`}
      >
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
          
          {/* Login and Signup Routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/event" element={<EventSection />} />
              <Route path="/event/:id" element={<Eventdetail />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/users" element={<Users />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/profile-dashboard" element={<ProfileDashboard />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
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
