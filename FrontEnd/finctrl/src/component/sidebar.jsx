import { ChevronLeft, ChevronRight, LayoutDashboard, CalendarDays, Users, UserCircle, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { title: "Event", icon: <CalendarDays size={20} />, path: "/event" },
    { title: "Profiles", icon: <UserCircle size={20} />, path: "/profiles" },
    { title: "Users", icon: <Users size={20} />, path: "/users" },
    { title: "Guide", icon: <FileText size={20} />, path: "/guide" },
  ];

  return (
    <div className={`fixed h-screen top-0 left-0 bg-white shadow-lg transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      {/* Sidebar Header */}
      <div className="flex items-center p-4 border-b">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} w-full`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-full w-10 h-10" />
              <div>
                <h2 className="text-sm font-semibold">User ID</h2>
                <p className="text-xs text-gray-500">user@example.com</p>
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
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
