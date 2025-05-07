import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-6">Track Your Board Game Stats</h1>
      <p className="text-lg mb-8 max-w-2xl">
        Keep track of your board game sessions, including characters played, points earned, 
        cards used, and more. Analyze your gameplay and improve your strategies!
      </p>
      
      {isAuthenticated() ? (
        <div className="space-x-4">
          <Link 
            to="/dashboard" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/games/new" 
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Add New Game
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link 
            to="/register" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </Link>
          <Link 
            to="/login" 
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;