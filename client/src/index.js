// index.js - Entry point for the Board Game Stats Tracker application
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import global styles
import './styles/index.css';

// Initialize the React application by creating a root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);