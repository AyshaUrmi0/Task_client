import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, Home, ClipboardList, User, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setProfileDropdown(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/add-task", label: "Add Task", icon: ClipboardList, requiresAuth: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? "py-2 bg-white/80 backdrop-blur-lg shadow-lg"
        : "py-4 bg-white"
    }`}>
      <div className="container flex items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative group">
              <div className="absolute transition-all duration-300 rounded-full opacity-75 -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 blur group-hover:blur-md" />
              <div className="relative flex items-center justify-center w-10 h-10 border-2 border-white rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text">
              My Daily Planner
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="items-center hidden space-x-6 md:flex">
          {navLinks.map((link) => {
            if (link.requiresAuth && !user) return null;
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`relative group px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 ${
                  isActive(link.path)
                    ? "text-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center px-3 py-2 space-x-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <div className="relative w-8 h-8 overflow-hidden border-2 border-purple-200 rounded-full">
                  <img
                    src={user.photoURL || "https://i.ibb.co.com/5jL18Qz/avater.webp"}
                    alt="Profile"
                    className="object-cover w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  profileDropdown ? "rotate-180" : ""
                }`} />
              </button>

              <AnimatePresence>
                {profileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 w-48 py-2 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => setProfileDropdown(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 space-x-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="flex items-center px-4 py-2 space-x-1 text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/sign-up"
                className="flex items-center px-4 py-2 space-x-1 text-white transition-all rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-md hover:shadow-purple-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="p-2 transition-colors rounded-lg md:hidden hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-t md:hidden"
          >
            <div className="container px-4 py-4 mx-auto space-y-3">
              {navLinks.map((link) => {
                if (link.requiresAuth && !user) return null;
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                      isActive(link.path)
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 space-x-2 text-gray-700 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 space-x-2 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-3 space-x-1 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/sign-up"
                    className="flex items-center justify-center px-4 py-3 space-x-1 text-white rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;