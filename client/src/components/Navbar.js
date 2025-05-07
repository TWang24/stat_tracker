import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Board Game Tracker</Link>
        <div className="flex space-x-4">
          {currentUser ? (
            // Logged in links
            <>
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link to="/games/new" className="hover:text-blue-200">Add Game</Link>
              <button
                onClick={handleLogout}
                className="hover:text-blue-200"
              >
                Logout
              </button>
              <span className="text-blue-200">Hi, {currentUser.username}</span>
            </>
          ) : (
            // Guest links
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;