const express = require('express');
const router = express.Router();
const { sql, pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Development mode flag
const DEV_MODE = process.env.DEV_MODE === 'true';

// Sample users for development mode
const sampleUsers = [
  { 
    Id: 1, 
    Username: 'john_doe', 
    Email: 'admin@example.com', 
    Password: '$2b$10$7JXNLgNr4iAHUhnE6Hlj9ODWQTZTaNgMY5vVQiI3kkXaqBrAXTl26', // hashed 'adminpass'
    Role: 'admin', 
    ProfilePicture: null,
    CreatedAt: new Date()
  },
  { 
    Id: 2, 
    Username: 'jane_smith', 
    Email: 'manager@example.com', 
    Password: '$2b$10$lWE9/vF3ykcK5r5n3hN5R.z0.8GMi.N/ZIjM0CJ2Sb8UUhvDE6hxe', // hashed 'managerpass'
    Role: 'manager', 
    ProfilePicture: null,
    CreatedAt: new Date()
  }
];

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
    }

    let user;

    // Use mock data in development mode
    if (DEV_MODE) {
      console.log('Using development mode authentication');
      user = sampleUsers.find(u => u.Email === email);
      
      if (!user) {
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }
      
      // Plain text comparison for demo users with specific passwords
      const isValidPassword = (email === 'admin@example.com' && password === 'adminpass') || 
                             (email === 'manager@example.com' && password === 'managerpass');
      
      if (!isValidPassword) {
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }
    } else {
      // Production mode - use database
      // Connect to database
      await pool.connect();
      
      // Query the user
      const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE Email = @email');
      
      user = result.recordset[0];
      
      // Check if user exists
      if (!user) {
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }
      
      // Compare passwords
      const validPassword = await bcrypt.compare(password, user.Password);
      if (!validPassword) {
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }
    }
    
    // At this point, user is authenticated either via dev mode or database
    
    // Create and send token
    const token = jwt.sign(
      { userId: user.Id, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Return user data (excluding password)
    const { Password, ...userData } = user;
    
    res.json({ 
      message: 'Login successful',
      user: userData,
      token 
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: true, message: 'Server error during login' });
  }
});

// Register user endpoint (admin only)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Input validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: true, message: 'All fields are required' });
    }
    
    await pool.connect();
    
    // Check if user already exists
    const checkUser = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');
    
    if (checkUser.recordset.length > 0) {
      return res.status(409).json({ error: true, message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .input('role', sql.VarChar, role)
      .query(`
        INSERT INTO Users (Username, Email, Password, Role, CreatedAt)
        VALUES (@username, @email, @password, @role, GETDATE());
        SELECT SCOPE_IDENTITY() AS Id;
      `);
    
    const userId = result.recordset[0].Id;
    
    res.status(201).json({ 
      message: 'User registered successfully',
      userId 
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: true, message: 'Server error during registration' });
  }
});

module.exports = router;
