import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../states/Slice";

const Header = () => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const loggedOutNavItems = [
    { id: 1, name: "Home", path: "/home", icon: "🏠" },
    { id: 2, name: "Login", path: "/login", icon: "→" },
    { id: 3, name: "Signup", path: "/register", icon: "+" }
  ];

  const userNavItems = [
    { id: 1, name: "Home", path: "/home", icon: "🏠" },
    { id: 2, name: "Change e-mail", path: "/profile", icon: "👤" },
    { id: 3, name: "My Bookings", path: "/bookings", icon: "📅" },
    { id: 4, name: "Booking History", path: "/history", icon: "📚" },
    { id: 5, name: "Logout", onClick: handleLogout, icon: "←" }
  ];

  const organizerNavItems = [
    { id: 1, name: "Dashboard", path: "/dashboard", icon: "📊" },
    { id: 2, name: "Manage Events", path: "/manage-events", icon: "📝" },
    { id: 3, name: "Logout", onClick: handleLogout, icon: "←" }
  ];

  const getNavItems = () => {
    if (!isLoggedIn) return loggedOutNavItems;
    return role === 'ROLE_ORGANIZER' ? organizerNavItems : userNavItems;
  };

  const headerBgClass = role === 'ROLE_ORGANIZER' 
    ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500'
    : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400';

  return (
    <nav className={`sticky top-0 z-50 ${headerBgClass} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 group">
            <h1 className="text-3xl font-extrabold text-white tracking-wider cursor-pointer
                         transform transition-all duration-300 ease-in-out
                         hover:scale-105 hover:text-transparent hover:bg-clip-text
                         hover:bg-gradient-to-r hover:from-white hover:to-teal-200
                         group-hover:animate-pulse">
              {role === 'ROLE_ORGANIZER' ? 'BookingBridge Organizer' : 'BookingBridge'}
            </h1>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full text-white
                     transition-all duration-300 ease-in-out
                     hover:bg-white/20 focus:outline-none
                     active:scale-95 transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-screen w-80 ${headerBgClass}
                    transform transition-transform duration-500 ease-in-out z-50
                    shadow-[-10px_0_20px_rgba(0,0,0,0.2)]
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
           
            <div className="flex-1 overflow-y-auto py-6">
              <div className="px-6 space-y-4">
                {getNavItems().map(item => (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                      setIsOpen(false);
                    }}
                    className="group block px-4 py-3 rounded-xl text-white
                             transform transition-all duration-300 ease-in-out
                             hover:bg-white/20 hover:translate-x-2
                             active:scale-95 cursor-pointer"
                  >
                    <span className="flex items-center gap-4 text-lg">
                      <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="font-medium tracking-wide">{item.name}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-white/20">
              <p className="text-white/70 text-sm text-center">
                © 2024 EventHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
