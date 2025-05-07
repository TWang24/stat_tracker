import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GameForm from './pages/GameForm.js';
import GameDetail from './pages/GameDetail';
import NotFound from './pages/NotFound';

// Import components
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/games/new" element={
                <PrivateRoute>
                  <GameForm />
                </PrivateRoute>
              } />
              <Route path="/games/edit/:id" element={
                <PrivateRoute>
                  <GameForm />
                </PrivateRoute>
              } />
              <Route path="/games/:id" element={
                <PrivateRoute>
                  <GameDetail />
                </PrivateRoute>
              } />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;