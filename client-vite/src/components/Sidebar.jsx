import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaTrophy,
  FaPlusCircle,
  FaCheckCircle,
  FaChartBar,
  FaUser,
  FaMedal,
  FaGraduationCap,
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const studentMenu = [
    { path: "/dashboard", label: "My Dashboard", icon: FaHome },
    { path: "/achievements", label: "My Achievements", icon: FaTrophy },
    { path: "/achievements/add", label: "Add Achievement", icon: FaPlusCircle },
    { path: "/gamification", label: "Gamification", icon: FaMedal },
    { path: "/hall-of-fame", label: "Hall of Fame", icon: FaGraduationCap },
  ];

  const adminMenu = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FaChartBar },
    { path: "/admin/verify", label: "Verify Achievements", icon: FaCheckCircle },
    { path: "/admin/analytics", label: "Analytics", icon: FaChartBar },
    { path: "/hall-of-fame", label: "Hall of Fame", icon: FaGraduationCap },
  ];

  const menu = user?.role === "student" ? studentMenu : adminMenu;

  return (
    <aside className="bg-white shadow-medium rounded-xl p-4 h-fit sticky top-20">
      <div className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
