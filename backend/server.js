require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const authRoutes = require('./routes/auth');
const machineRoutes = require('./routes/machines');
const userRoutes = require('./routes/users');
const parameterRoutes = require('./routes/parameters');

// Development mode flag (set to true to enable mock data instead of database)
// This allows the API to work without a database during development
const DEV_MODE = process.env.DEV_MODE === 'true';

// Database configuration from environment variables
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // For Azure
    trustServerCertificate: true // For local dev / self-signed certs
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
if (!DEV_MODE) {
  sql.connect(dbConfig)
    .then(() => console.log('Connected to MSSQL Database'))
    .catch(err => {
      console.error('Database connection error:', err);
      console.log('To use the application without a database, set DEV_MODE=true in your .env file');
    });
} else {
  console.log('Running in DEVELOPMENT MODE with mock data - No database connection required');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parameters', parameterRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: true, 
    message: err.message || 'An error occurred on the server' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
