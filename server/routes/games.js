// Game session routes
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');

// Apply auth middleware to all game routes
router.use(auth);

// Create a new game session
// POST /api/games
router.post('/', gameController.createGameSession);

// Get all game sessions for current user
// GET /api/games
router.get('/', gameController.getGameSessions);

// Get a single game session by ID
// GET /api/games/:id
router.get('/:id', gameController.getGameSessionById);

// Update a game session
// PUT /api/games/:id
router.put('/:id', gameController.updateGameSession);

// Delete a game session
// DELETE /api/games/:id
router.delete('/:id', gameController.deleteGameSession);

module.exports = router;