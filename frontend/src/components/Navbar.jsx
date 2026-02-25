import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckSquare, Menu, X } from "lucide-react";


const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    onLogout();
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group"
            onClick={closeMenu}
          >
            <div className="bg-linear-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-md">
              <CheckSquare className="text-white" size={20} />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskManager
            </span>
          </Link>

          {/* Desktop Auth Section */}
          {!isLoginPage && !isSignupPage && (
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  {/* ✅ Shows user name from props */}
                  <span className="font-semibold text-gray-700">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-blue-600 font-semibold rounded-lg border-2 border-blue-300 hover:bg-blue-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isLoginPage && !isSignupPage && (
            <button
              className="md:hidden text-gray-700 p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && !isLoginPage && !isSignupPage && (
        <div className="md:hidden bg-white border-t-2 border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <div className="text-center font-semibold text-gray-700">
                  Welcome, {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-center text-blue-600 font-semibold border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-center bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;