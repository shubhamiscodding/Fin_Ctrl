import { ChevronLeft, ChevronRight, LayoutDashboard, CalendarDays, Users, UserCircle, FileText, LogOut } from "lucide-react"; // Add LogOut icon
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hooks

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth0(); // Destructure user and isAuthenticated from Auth0
  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { title: "Event", icon: <CalendarDays size={20} />, path: "/event" },
    { title: "Profiles", icon: <UserCircle size={20} />, path: "/profiles" },
    { title: "Users", icon: <Users size={20} />, path: "/users" },
    { title: "Guide", icon: <FileText size={20} />, path: "/guide" },
  ];

  // Handle logout
  const handleLogout = () => {
    logout({
      returnTo: window.location.origin, // Redirect to the home page after logout
    });
  };

  return (
    <div className={`fixed h-screen top-0 left-0 bg-white shadow-lg transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      {/* Sidebar Header */}
      <div className="flex items-center p-4 border-b">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} w-full`}>
          {!isCollapsed && isAuthenticated && (
            <div className="flex items-center gap-2">
              <img src={user?.picture} alt="Profile" className="rounded-full w-10 h-10" />
              <div>
                <h2 className="text-sm font-semibold">{user?.name}</h2>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded-lg hover:bg-gray-100">
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
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
          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className={`flex items-center p-2 rounded-lg text-gray-700 transition hover:bg-gray-100`}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
