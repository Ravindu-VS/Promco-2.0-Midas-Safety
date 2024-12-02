import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from '../hooks/useTheme'; // Ensure this is the correct path

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

    const userRole = await authenticateUser(email, password);

    if (userRole) {
      // Store user info in localStorage
      const user = sampleUsers.find((user) => user.email === email);
      localStorage.setItem("user", JSON.stringify({ email, role: userRole, username: user.username }));
      redirectToDashboard(userRole);
    } else {
      setError('Invalid email or password');
    }
  };

  const authenticateUser = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = sampleUsers.find((user) => user.email === email && user.password === password);
        if (user) {
          resolve(user.role);
        } else {
          resolve(null);
        }
      }, 1000);
    });
  };

  const redirectToDashboard = (role) => {
    // Redirect user to dashboard based on their role
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
