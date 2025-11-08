import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTrophy, FaUser, FaSignOutAlt, FaBars, FaGraduationCap } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-medium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaTrophy className="text-primary-600 text-2xl" />
            <span className="text-xl font-bold gradient-text">Achievement Portal</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/hall-of-fame"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
            >
              <FaGraduationCap />
              <span>Hall of Fame</span>
            </Link>
            {user ? (
              <>
                <Link
                  to={user.role === "student" ? "/dashboard" : "/admin/dashboard"}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {user.role !== "student" && (
                  <Link
                    to="/admin/verify"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Verify
                  </Link>
                )}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-gray-500" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold capitalize">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600"
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <Link
              to="/hall-of-fame"
              className="block text-gray-700 hover:text-primary-600 font-medium mb-3 flex items-center space-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaGraduationCap />
              <span>Hall of Fame</span>
            </Link>
            {user ? (
              <div className="space-y-3">
                <Link
                  to={user.role === "student" ? "/dashboard" : "/admin/dashboard"}
                  className="block text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role !== "student" && (
                  <Link
                    to="/admin/verify"
                    className="block text-gray-700 hover:text-primary-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Verify
                  </Link>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <FaUser className="text-gray-500" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold capitalize">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
