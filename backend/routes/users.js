const express = require('express');
const router = express.Router();
const { sql, pool } = require('../config/db');

// Middleware to check authentication
const authenticate = require('../middleware/authenticate');

// Development mode flag
const DEV_MODE = process.env.DEV_MODE === 'true';

// Sample users for development mode
const sampleUsers = [
  { 
    Id: 1, 
    Username: 'john_doe', 
    Email: 'admin@example.com', 
    Role: 'admin', 
    ProfilePicture: null,
    CreatedAt: new Date()
  },
  { 
    Id: 2, 
    Username: 'jane_smith', 
    Email: 'manager@example.com',
    Role: 'manager', 
    ProfilePicture: null,
    CreatedAt: new Date()
  }
];

// Get all users
router.get('/', authenticate(['admin']), async (req, res) => {
  try {
    // Use mock data in development mode
    if (DEV_MODE) {
      console.log('Using development mode for users list');
      return res.json(sampleUsers);
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .query('SELECT Id, Username, Email, Role, ProfilePicture, CreatedAt FROM Users');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err);
    if (DEV_MODE) {
      // Fallback to mock data even if there's an error
      return res.json(sampleUsers);
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve users' });
  }
});

// Get user by ID
router.get('/:id', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure users can only access their own data unless they're admin
    if (req.user.role !== 'admin' && req.user.userId != id) {
      return res.status(403).json({ error: true, message: 'Access denied' });
    }
    
    // Use mock data in development mode
    if (DEV_MODE) {
      const user = sampleUsers.find(u => u.Id == id);
      if (!user) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
      return res.json(user);
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT Id, Username, Email, Role, ProfilePicture, CreatedAt FROM Users WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    if (DEV_MODE) {
      // Try fallback to mock data
      const user = sampleUsers.find(u => u.Id == id);
      if (user) {
        return res.json(user);
      }
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve user' });
  }
});

// Create user (admin only)
router.post('/', authenticate(['admin']), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Input validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: true, message: 'All fields are required' });
    }
    
    // Handle dev mode
    if (DEV_MODE) {
      console.log('Creating user in development mode');
      // Check for duplicate email in mock data
      const userExists = sampleUsers.some(user => user.Email === email);
      if (userExists) {
        return res.status(409).json({ error: true, message: 'User already exists' });
      }
      
      // In dev mode, just return success with a mock ID
      return res.status(201).json({ 
        message: 'User created successfully (DEV MODE)',
        userId: Math.floor(Math.random() * 1000) + 3 // Random ID starting from 3
      });
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
    const bcrypt = require('bcrypt');
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
      message: 'User created successfully',
      userId 
    });
  } catch (err) {
    console.error('Error creating user:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.status(201).json({ 
        message: 'User created successfully (DEV MODE - Error Fallback)',
        userId: Math.floor(Math.random() * 1000) + 3
      });
    }
    res.status(500).json({ error: true, message: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, profilePicture } = req.body;
    
    // Ensure users can only update their own data unless they're admin
    if (req.user.role !== 'admin' && req.user.userId != id) {
      return res.status(403).json({ error: true, message: 'Access denied' });
    }
    
    // Only admin can change roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'Only admins can change roles' });
    }
    
    // Handle dev mode
    if (DEV_MODE) {
      console.log('Updating user in development mode', id);
      const userIndex = sampleUsers.findIndex(u => u.Id == id);
      
      // Check if user exists in dev mode
      if (userIndex === -1) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
      
      // Return success response in dev mode
      return res.json({ 
        message: 'User updated successfully (DEV MODE)', 
        user: { id } 
      });
    }
    
    await pool.connect();
    
    // Build dynamic update query
    let updateQuery = 'UPDATE Users SET ';
    const inputs = [];
    
    if (username) {
      inputs.push('Username = @username');
    }
    
    if (email) {
      inputs.push('Email = @email');
    }
    
    if (role && req.user.role === 'admin') {
      inputs.push('Role = @role');
    }
    
    if (profilePicture) {
      inputs.push('ProfilePicture = @profilePicture');
    }
    
    updateQuery += inputs.join(', ') + ' WHERE Id = @id';
    
    // Execute update
    const request = pool.request()
      .input('id', sql.Int, id);
      
    if (username) request.input('username', sql.VarChar, username);
    if (email) request.input('email', sql.VarChar, email);
    if (role && req.user.role === 'admin') request.input('role', sql.VarChar, role);
    if (profilePicture) request.input('profilePicture', sql.VarChar, profilePicture);
    
    const result = await request.query(updateQuery);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.json({ 
        message: 'User updated successfully (DEV MODE - Error Fallback)', 
        user: { id: req.params.id } 
      });
    }
    res.status(500).json({ error: true, message: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Handle dev mode
    if (DEV_MODE) {
      console.log('Deleting user in development mode', id);
      const userIndex = sampleUsers.findIndex(u => u.Id == id);
      
      // Check if user exists in dev mode
      if (userIndex === -1) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
      
      // Return success response in dev mode
      return res.json({ message: 'User deleted successfully (DEV MODE)' });
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.json({ message: 'User deleted successfully (DEV MODE - Error Fallback)' });
    }
    res.status(500).json({ error: true, message: 'Failed to delete user' });
  }
});

module.exports = router;
