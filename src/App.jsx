import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css'; // Import the CSS file
import Login from './Login'; // Import the Login component
import Signup from './SignUp'; // Import the Signup component
import Dashboard from './Dashboard'; // Import the Dashboard component

function Home() {
  return (
    <div className="app">
      <main className="homepage">
      <img 
        src="/logo.png"
        alt="FadeFraud Logo"
        className="homepage-title"
      />
        <Link to="/login" className="login-button">
          Log in
        </Link>
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Check login status on component mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Store login status in localStorage
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page with FadeFraud and Login button */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Login page */}
        <Route path="/signup" element={<Signup />} /> {/* Sign-up page */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} /> {/* Dashboard page */}
      </Routes>
    </Router>
  );
}

export default App;
