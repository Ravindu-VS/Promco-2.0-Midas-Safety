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

  // Fetch user list from local storage
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (storedUsers && storedUsers.length > 0) {
      setUserList(storedUsers);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check for matching user credentials in userList
    const user = userList.find(user => user.email === email && user.password === password);

    if (user) {
      // Store user data in local storage
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      redirectToDashboard(user.role);
    } else {
      setError('Invalid email or password');
    }
  };

  const redirectToDashboard = (role) => {
    // Navigate to different routes based on role
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
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

      <a href="https://www.midassafety.com/" target="_blank" rel="noopener noreferrer" className="logo-link">
        <img
          src={`${process.env.PUBLIC_URL}/logo-light.png`}
          alt="Logo"
          className="logo"
        />
      </a>
    </div>
  );
}

export default Login;
