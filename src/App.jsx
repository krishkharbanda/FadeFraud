import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css'; // Import the CSS file
import Login from './Login'; // Import the Login component
import Signup from './SignUp'; // Import the Signup component
import Dashboard from './Dashboard'; // Import the Dashboard component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Placeholder login function
  const handleLogin = () => {
    setIsLoggedIn(true); // Set the user as logged in
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} /> {/* Login page */}
        <Route path="/signup" element={<Signup />} /> {/* Sign-up page */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} /> {/* Dashboard page */}
      </Routes>
    </Router>
  );
}

export default App;
