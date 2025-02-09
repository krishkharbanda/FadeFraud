import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; 


function Login() {
  return (
    <div className="app">
      <main className="homepage">
        <h1 className="homepage-title">Log In</h1>
        <form className="login-form">
          <input type="email" placeholder="Email" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <button type="submit" className="login-button">Log in</button>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </main>
    </div>
  );
}

export default Login;
