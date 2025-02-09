import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // useNavigate hook for navigation

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Placeholder for actual authentication logic (e.g., API call)
    if (email && password) {
      onLogin();  // Call the onLogin function from the parent component (App)
      navigate('/dashboard');  // Navigate to the Dashboard after successful login
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <div className="app">
      <main className="homepage">
        <h1 className="homepage-title">Log In</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            className="login-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="login-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
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
