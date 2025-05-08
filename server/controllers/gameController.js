// Game controller for handling game session CRUD operations
const GameSession = require('../models/GameSession');

// Create a new game session
exports.createGameSession = async (req, res) => {
  try {
    const { characterPlayed, pointsEarned, cardsPlayed, gameType, notes, opponents, winner } = req.body;
    
    // Create new game session with the user ID from the token
    const gameSession = new GameSession({
      user: req.user.userId,
      characterPlayed,
      pointsEarned,
      cardsPlayed,
      gameType,
      notes,
      opponents,
      winner
    });

    // Save to database
    await gameSession.save();
    
    res.status(201).json(gameSession);
  } catch (error) {
    console.error('Error creating game session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all game sessions for the current user
exports.getGameSessions = async (req, res) => {
  try {
    const gameSessions = await GameSession.find({ user: req.user.userId })
      .sort({ gameDate: -1 }); // Sort by date, newest first
    
    res.json(gameSessions);
  } catch (error) {
    console.error('Error getting game sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single game session by ID
exports.getGameSessionById = async (req, res) => {
  try {
    const gameSession = await GameSession.findById(req.params.id);
    
    // Check if game session exists
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }
    
    // Check if the game session belongs to the current user
    if (gameSession.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to access this game session' });
    }
    
    res.json(gameSession);
  } catch (error) {
    console.error('Error getting game session by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a game session
exports.updateGameSession = async (req, res) => {
  try {
    const { characterPlayed, pointsEarned, cardsPlayed, gameType, notes, opponents, winner } = req.body;
    
    // Find the game session
    let gameSession = await GameSession.findById(req.params.id);
    
    // Check if game session exists
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }
    
    // Check if the game session belongs to the current user
    if (gameSession.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to update this game session' });
    }
    
    // Update fields
    gameSession.characterPlayed = characterPlayed || gameSession.characterPlayed;
    gameSession.pointsEarned = pointsEarned !== undefined ? pointsEarned : gameSession.pointsEarned;
    gameSession.cardsPlayed = cardsPlayed || gameSession.cardsPlayed;
    gameSession.gameType = gameType || gameSession.gameType;
    gameSession.notes = notes || gameSession.notes;
    gameSession.opponents = opponents || gameSession.opponents;
    gameSession.winner = winner !== undefined ? winner : gameSession.winner;
    
    // Save updated game session
    await gameSession.save();
    
    res.json(gameSession);
  } catch (error) {
    console.error('Error updating game session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a game session
exports.deleteGameSession = async (req, res) => {
  try {
    // Find the game session
    const gameSession = await GameSession.findById(req.params.id);
    
    // Check if game session exists
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }
    
    // Check if the game session belongs to the current user
    if (gameSession.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to delete this game session' });
    }
    
    // Delete the game session
    await gameSession.remove();
    
    res.json({ message: 'Game session removed' });
  } catch (error) {
    console.error('Error deleting game session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};