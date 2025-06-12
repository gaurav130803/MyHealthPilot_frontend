import React, { useState, useEffect, useRef } from 'react';
import logo from '../images/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const username = localStorage.getItem('username');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 text-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-xl font-semibold">MyHealthPilot</span>
        </div>
      </Link>

      {/* Right side */}
      {accessToken ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-green-400 font-semibold text-3xl"
          >
            {username || 'User'}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-10">
              <Link to="/profile">
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Profile</div>
              </Link>
              <div
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-red-500"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
