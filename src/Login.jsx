import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './App.css'; // Import the same CSS file

function Login() {
  return (
    <div className="app">
      <main className="homepage">
        <form className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
          />
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
        <p className="signup-text">
          Do not have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </main>
    </div>
  );
}

export default Login;