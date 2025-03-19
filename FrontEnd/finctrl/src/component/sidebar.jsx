import { ChevronLeft, ChevronRight, LayoutDashboard, CalendarDays, Users, UserCircle, FileText, LogOut, Calendar, MessageSquare } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(localStorage.getItem("userPic") || "https://via.placeholder.com/40");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const storedPic = localStorage.getItem("userPic") || "https://via.placeholder.com/40"; // Fixed typo
      setUser(storedUser);
      setProfilePic(storedPic);
      console.log("Updated user from localStorage:", storedUser);
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { title: "Event", icon: <CalendarDays size={20} />, path: "/event" },
    { title: "Calendar", icon: <Calendar size={20} />, path: "/calendar" },
    { title: "Profiles", icon: <UserCircle size={20} />, path: "/profiles" },
    { title: "Users", icon: <Users size={20} />, path: "/users" },
    { title: "Guide", icon: <FileText size={20} />, path: "/guide" },
    { title: "Chat", icon: <MessageSquare size={20} />, path: "/chat" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userPic");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile-dashboard");
  };

  const displayName = user.adminName || user.username || "User";
  const displayEmail = user.email || "No email";

  return (
    <div className={`fixed h-screen top-0 left-0 bg-white shadow-lg transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      <div className="flex items-center p-4 border-b">
        <div className={`flex items-center w-full ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed ? (
            <img
              src="https://res.cloudinary.com/dqhn4dq02/image/upload/v1741248835/hudrwpm8ah1hnlfo0ahm.png"
              alt="LOGO"
              className="max-h-15"
            />
          ) : null}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg text-gray-700 transition ${
                  location.pathname === item.path ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                {!isCollapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center p-3 rounded-lg text-gray-700 cursor-pointer transition hover:bg-gray-100"
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </li>
        </ul>
        {user && (
          <div
            onClick={handleProfileClick}
            className="flex items-center gap-2 mt-35 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <img src={profilePic} alt="Profile" className="rounded-full w-10 h-10" />
            ) : (
              <div className="flex gap-1.5">
                <img src={profilePic} alt="Profile" className="rounded-full w-10 h-10" />
                <div>
                  <h2 className="text-sm font-semibold">{displayName}</h2>
                  <p className="text-xs text-gray-500">{displayEmail}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;