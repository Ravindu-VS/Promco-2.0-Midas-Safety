const sql = require('mssql');
require('dotenv').config();

// Database configuration
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

// Create a connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Handle connection errors
poolConnect.catch(err => {
  console.error('SQL Connection Error: ', err);
});

module.exports = {
  sql,
  pool,
  poolConnect
};
