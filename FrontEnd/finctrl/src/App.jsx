import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./component/sidebar";
import EventSection from "./component/eventsection";
import Dashboard from "./component/dashboard"; 
import Profiles from "./component/profiles"; 
import Users from "./component/user"; 
import Guide from "./component/guide"; 

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex">
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        <div className={`flex-1 p-2 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-59"}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/event" element={<EventSection />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/users" element={<Users />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
