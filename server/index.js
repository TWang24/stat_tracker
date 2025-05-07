// Main server file - Entry point for our backend application
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Board Game Tracker API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});