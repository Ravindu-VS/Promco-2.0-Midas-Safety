import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Sample users if no data is in localStorage
  const sampleUsers = [
    {
      id: '1',
      username: 'john_doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'password123',
    },
    {
      id: '2',
      username: 'jane_smith',
      email: 'jane.smith@example.com',
      role: 'manager',
      password: 'password123',
    },
    {
      id: '3',
      username: 'michael_jordan',
      email: 'michael.jordan@example.com',
      role: 'operator',
      password: 'password123',
    },
    {
      id: '4',
      username: 'emily_clark',
      email: 'emily.clark@example.com',
      role: 'user',
      password: 'password123',
    },
  ];

  const [storedUsers, setStoredUsers] = useState([]);

  useEffect(() => {
    // Retrieve users stored in localStorage
    const usersFromStorage = JSON.parse(localStorage.getItem('users'));

    if (usersFromStorage && usersFromStorage.length > 0) {
      setStoredUsers(usersFromStorage);
    } else {
      // Use sample users if no users are stored in localStorage
      setStoredUsers(sampleUsers);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const userRole = authenticateUser(email, password);
    if (userRole) {
      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify({ email, role: userRole }));
      redirectToDashboard(userRole);
    } else {
      setError('Invalid email or password');
    }
  };

  // Authenticate user from the stored users list (either from localStorage or sample data)
  const authenticateUser = (email, password) => {
    const user = storedUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
    );
    return user ? user.role : null;
  };

  const redirectToDashboard = (role) => {
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Promco 2.0</h1>
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

      <a href="https://www.midassafety.com/" target="_blank" rel="noopener noreferrer" className="logo-link">
        <img
          src={`${process.env.PUBLIC_URL}/MIDAS-Logo12.png`}
          alt="Logo" className="logo" />
      </a>
    </div>
  );
}

export default Login;
