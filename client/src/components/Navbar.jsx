import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthButton from './AuthButton.jsx';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 shadow-sm py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white tracking-wide hover:underline">
        News-Portal
      </Link>
      {isHome && (
        <div className="flex items-center space-x-4">
          <Link to="/admin/login">
            <button className="w-32 h-11 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition text-base border border-blue-200">Admin Login</button>
          </Link>
          <div className="w-32 h-11 flex items-center justify-center">
            <AuthButton customClass="w-full h-full bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition text-base border border-blue-200" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 