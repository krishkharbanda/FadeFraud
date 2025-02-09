import React from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported for routing
import './App.css'; // Import the same CSS for consistency

function Signup() {
  return (
    <div className="app">
      <main className="homepage">
        <h1 className="homepage-title">Sign Up</h1>
        <form className="login-form">
          <input type="email" placeholder="Email" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <input type="password" placeholder="Confirm Password" className="login-input" />
          <button type="submit" className="login-button">Sign Up</button>
        </form>
        <p className="signup-text">Already have an account?</p>
        <div className="signup-link-container">
          <Link to="/login" className="signup-link">Log in</Link>
        </div>
      </main>
    </div>
  );
}

export default Signup;
