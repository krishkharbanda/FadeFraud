import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Import the CSS file
import Login from './Login'; // Import the Login component

// Homepage Component
function Home() {
  return (
    <div className="app">
      <main className="homepage">
        <h1 className="homepage-title">FadeFraud</h1>
        <Link to="/login" className="login-button">
          Log in
        </Link>
      </main>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Homepage route */}
        <Route path="/login" element={<Login />} /> {/* Login page route */}
      </Routes>
    </Router>
  );
}

export default App;