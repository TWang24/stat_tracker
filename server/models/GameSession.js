// GameSession model for tracking board game statistics
const mongoose = require('mongoose');

const GameSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  characterPlayed: {
    type: String,
    required: true,
    trim: true
  },
  pointsEarned: {
    type: Number,
    required: true
  },
  cardsPlayed: [{
    type: String,
    trim: true
  }],
  gameDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  // You can extend this with more fields as needed
  gameType: {
    type: String,
    trim: true
  },
  opponents: [{
    name: String,
    character: String,
    points: Number
  }],
  winner: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('GameSession', GameSessionSchema);