import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from '../hooks/useTheme'; 
import { loginUser } from '../services/authService'; // Import the loginUser function

// Sample users are kept for development fallback until the backend is fully configured
const sampleUsers = [
  { id: '1', username: 'john_doe', email: 'admin@example.com', role: 'admin', password: 'adminpass', profilePicture: '' },
  { id: '2', username: 'jane_smith', email: 'manager@example.com', role: 'manager', password: 'managerpass', profilePicture: '' },
  { id: '3', username: 'michael_jordan', email: 'operator@example.com', role: 'operator', password: 'operatorpass', profilePicture: '' },
  { id: '4', username: 'emily_clark', email: 'user@example.com', role: 'user', password: 'userpass', profilePicture: '' },
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { theme } = useTheme(); // Get theme from useTheme hook

  useEffect(() => {
    console.log('Current theme:', theme); // Check current theme
  }, [theme]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    setError(''); // Clear any previous errors

    try {
      // Call the loginUser service that connects to the backend
      const response = await loginUser(email, password);
      
      // Authentication successful
      console.log('Login successful:', response);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      
      // For development purposes - if backend isn't fully set up, use local sample users
      // DEVELOPMENT FALLBACK ONLY - REMOVE IN PRODUCTION
      console.log('Attempting fallback authentication for development');
      const user = sampleUsers.find(
        (user) => user.email === email && user.password === password
      );
      
      if (user) {
        console.log('Fallback authentication successful');
        localStorage.setItem('user', JSON.stringify({
          email,
          role: user.role,
          username: user.username
        }));
        navigate('/dashboard');
        return;
      }
      
      setError(error.response?.data?.message || 'Invalid email or password');
    }
  };

  // Removed redundant redirectToDashboard function as we now navigate directly

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
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      {/* Logo section */}
      <a href="https://www.midassafety.com/" target="_blank" rel="noopener noreferrer" className="logo-link">
        <img
          src={`${process.env.PUBLIC_URL}/logo-light.png`}
          alt="Light Mode Logo"
          className="logo logo-light" // Show only in light mode
        />
        <img
          src={`${process.env.PUBLIC_URL}/logo-dark.png`}
          alt="Dark Mode Logo"
          className="logo logo-dark" // Show only in dark mode
        />
      </a>
    </div>
  );
}

export default Login;
