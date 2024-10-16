import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure the CSS file is in the same directory
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons for show/hide

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });

    // Simulate authentication and get user role
    const userRole = await fakeAuth(email, password);

    if (userRole) {
      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify({ email, role: userRole }));
      redirectToDashboard(userRole);
    } else {
      setError('Invalid email or password');
    }
  };

  const fakeAuth = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate authentication based on email and password
        if (email === 'admin@example.com' && password === 'adminpass') {
          resolve('admin');
        } else if (email === 'manager@example.com' && password === 'managerpass') {
          resolve('manager');
        } else if (email === 'operator@example.com' && password === 'operatorpass') {
          resolve('operator');
        } else if (email === 'user@example.com' && password === 'userpass') {
          resolve('user');
        } else {
          resolve(null);
        }
      }, 1000);
    });
  };

  const redirectToDashboard = (role) => {
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <h1 className="header-title">Promco 2.0</h1>
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input password-input"
              required
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      {/* Logo section */}
      <a href="https://www.midassafety.com/" target="_blank" rel="noopener noreferrer" className="logo-link">
      <img
          src={`${process.env.PUBLIC_URL}/Logo.png`}
          alt="Logo"
          className="logo"
        />
      </a>
    </div>
  );
}

export default Login;
