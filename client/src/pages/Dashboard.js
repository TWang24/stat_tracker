import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [gameSessions, setGameSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { api } = useAuth();

  useEffect(() => {
    const fetchGameSessions = async () => {
      try {
        const res = await api.get('/games');
        setGameSessions(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch game sessions');
        setLoading(false);
      }
    };

    fetchGameSessions();
  }, [api]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this game session?')) {
      try {
        await api.delete(`/games/${id}`);
        setGameSessions(gameSessions.filter(game => game._id !== id));
      } catch (err) {
        setError('Failed to delete game session');
      }
    }
  };

  // Calculate statistics
  const totalGames = gameSessions.length;
  const totalPoints = gameSessions.reduce((sum, game) => sum + game.pointsEarned, 0);
  const averagePoints = totalGames > 0 ? (totalPoints / totalGames).toFixed(1) : 0;
  
  // Get most played character
  const characterCounts = {};
  gameSessions.forEach(game => {
    const char = game.characterPlayed;
    characterCounts[char] = (characterCounts[char] || 0) + 1;
  });
  
  let mostPlayedCharacter = 'None';
  let maxCount = 0;
  
  Object.entries(characterCounts).forEach(([char, count]) => {
    if (count > maxCount) {
      mostPlayedCharacter = char;
      maxCount = count;
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Game Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Games</h3>
          <p className="text-2xl">{totalGames}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Average Points</h3>
          <p className="text-2xl">{averagePoints}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Most Played Character</h3>
          <p className="text-2xl">{mostPlayedCharacter}</p>
        </div>
      </div>
      
      {/* Add New Game Button */}
      <div className="mb-6">
        <Link 
          to="/games/new" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Game Session
        </Link>
      </div>
      
      {/* Game Sessions List */}
      <h2 className="text-2xl font-semibold mb-4">Your Game History</h2>
      
      {loading ? (
        <p>Loading your game sessions...</p>
      ) : gameSessions.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded text-center">
          <p className="text-lg mb-4">You haven't recorded any game sessions yet.</p>
          <Link 
            to="/games/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Record Your First Game
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Character</th>
                <th className="py-3 px-6 text-left">Points</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Game Type</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {gameSessions.map(game => (
                <tr key={game._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{game.characterPlayed}</td>
                  <td className="py-3 px-6 text-left">{game.pointsEarned}</td>
                  <td className="py-3 px-6 text-left">
                    {new Date(game.gameDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">{game.gameType || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center space-x-2">
                      <Link 
                        to={`/games/${game._id}`} 
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/games/edit/${game._id}`} 
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(game._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;