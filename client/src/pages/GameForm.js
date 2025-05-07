import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

const GameForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const { api } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Check if we're editing an existing game session
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setFetchLoading(true);

      const fetchGameSession = async () => {
        try {
          const res = await api.get(`/games/${id}`);
          const game = res.data;
          
          // Set form values
          setValue('characterPlayed', game.characterPlayed);
          setValue('pointsEarned', game.pointsEarned);
          setValue('cardsPlayed', game.cardsPlayed.join(', '));
          setValue('gameType', game.gameType);
          setValue('notes', game.notes);
          setValue('winner', game.winner);
          
          // If there are opponents, set them too
          if (game.opponents && game.opponents.length > 0) {
            const opponentsStr = game.opponents.map(opp => 
              `${opp.name}:${opp.character}:${opp.points}`
            ).join('\n');
            setValue('opponents', opponentsStr);
          }
          
          setFetchLoading(false);
        } catch (err) {
          setError('Failed to fetch game session');
          setFetchLoading(false);
        }
      };

      fetchGameSession();
    }
  }, [id, api, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      // Process card played (split by comma and trim)
      const cardsPlayed = data.cardsPlayed
        ? data.cardsPlayed.split(',').map(card => card.trim())
        : [];
      
      // Process opponents
      const opponents = data.opponents
        ? data.opponents.split('\n').map(oppLine => {
            const [name, character, points] = oppLine.split(':');
            return {
              name: name?.trim(),
              character: character?.trim(),
              points: points ? parseInt(points.trim(), 10) : 0
            };
          })
        : [];

      const gameData = {
        characterPlayed: data.characterPlayed,
        pointsEarned: parseInt(data.pointsEarned, 10),
        cardsPlayed,
        gameType: data.gameType,
        notes: data.notes,
        opponents,
        winner: data.winner
      };

      if (isEditing) {
        await api.put(`/games/${id}`, gameData);
      } else {
        await api.post('/games', gameData);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save game session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Game Session' : 'Record New Game Session'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {fetchLoading ? (
        <p>Loading game data...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="characterPlayed">
              Character Played *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="characterPlayed"
              type="text"
              placeholder="Character Name"
              {...register('characterPlayed', { required: 'Character name is required' })}
            />
            {errors.characterPlayed && (
              <p className="text-red-500 text-xs italic mt-1">{errors.characterPlayed.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pointsEarned">
              Points Earned *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="pointsEarned"
              type="number"
              placeholder="Points"
              {...register('pointsEarned', { 
                required: 'Points are required',
                min: {
                  value: 0,
                  message: 'Points cannot be negative'
                }
              })}
            />
            {errors.pointsEarned && (
              <p className="text-red-500 text-xs italic mt-1">{errors.pointsEarned.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardsPlayed">
              Cards Played
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cardsPlayed"
              type="text"
              placeholder="Comma-separated list of cards"
              {...register('cardsPlayed')}
            />
            <p className="text-gray-500 text-xs italic mt-1">Separate card names with commas</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameType">
              Game Type
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="gameType"
              type="text"
              placeholder="Type of game"
              {...register('gameType')}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="opponents">
              Opponents
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="opponents"
              placeholder="One opponent per line: Name:Character:Points"
              rows="3"
              {...register('opponents')}
            ></textarea>
            <p className="text-gray-500 text-xs italic mt-1">
              Format: Name:Character:Points (one per line)
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="winner">
              Winner
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="winner"
              type="text"
              placeholder="Who won the game"
              {...register('winner')}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
              Notes
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="notes"
              placeholder="Any notes about the game session"
              rows="4"
              {...register('notes')}
            ></textarea>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Game' : 'Save Game'}
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GameForm;