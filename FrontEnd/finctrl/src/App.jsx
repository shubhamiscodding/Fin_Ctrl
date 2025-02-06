import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./component/sidebar";
import EventSection from "./component/eventsection";
import Dashboard from "./component/dashboard"; 
import Profiles from "./component/profiles"; 
import Users from "./component/user"; 
import Guide from "./component/guide"; 
import SignIn from "./component/signin";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Track authentication state

  // Handle login
  const handleLogin = (username, password) => {
    // Example login logic, replace with your actual authentication logic
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true); // Set authenticated state to true
    }
  };

  return (
    <Router>
      <div className="flex">
        {/* Only show sidebar when authenticated */}
        {isAuthenticated && (
          <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        )}

        <div className={`flex-1 p-2 transition-all duration-200 ${isSidebarCollapsed ? "ml-18" : "ml-60"}`}>
          <Routes>
            {/* Redirect to dashboard or login based on authentication status */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
            
            {/* Public route for SignIn */}
            <Route path="/login" element={<SignIn onLogin={handleLogin} />} />
            
            {/* Protected routes - only accessible if authenticated */}
            {isAuthenticated && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/event" element={<EventSection />} />
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/users" element={<Users />} />
                <Route path="/guide" element={<Guide />} />
              </>
            )}

            {/* Redirect any other route to login if not authenticated */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
