import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./component/sidebar";
import EventSection from "./component/eventsection";
import Dashboard from "./component/dashboard"; 
import Profiles from "./component/profiles"; 
import Users from "./component/user"; 
import Guide from "./component/guide"; 
import LogIn from "./component/login.jsx";
import Callback from "./component/Callback.jsx";  // Import Callback

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Track authentication state

  // Define your Auth0 credentials here
  const domain = "dev-vhremigf6pt2jazt.us.auth0.com"; // Replace with your Auth0 domain
  const clientId = "y0sy8cGlMrz4HuN0r7kTNbJEmWP0FoPX"; // Replace with your Auth0 client ID

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin + "/callback" }}  // Update with your callback URL
    >
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
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/logIn" />}
              />
              
              {/* Public route for SignIn */}
              <Route path="/logIn" element={<LogIn />} /> {/* Change to LogIn */}

              {/* Callback route - handles the Auth0 login redirect */}
              <Route path="/callback" element={<Callback />} />

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
              <Route path="*" element={<Navigate to="/logIn" />} /> {/* Change to /logIn */}
            </Routes>
          </div>
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;
