# MSSQL Connection Troubleshooting Guide

This guide will help you resolve common issues with connecting to an MSSQL database from the Promco 2.0 application.

## Current Issue

The application is currently experiencing a 500 Internal Server Error when attempting to connect to the MSSQL database. This typically happens when:

1. The SQL Server is not accessible
2. The credentials in `.env` are incorrect
3. The required database or tables don't exist yet
4. The SQL Server authentication mode is not properly configured

## Steps to Resolve MSSQL Connection Issues

### 1. Verify SQL Server Installation and Status

- Ensure SQL Server is installed and running
- Check SQL Server Services in Windows Services (services.msc)
- Verify SQL Server Browser service is running (needed for named instances)

### 2. Check SQL Server Authentication Mode

- Open SQL Server Management Studio (SSMS)
- Right-click on the server → Properties → Security
- Ensure "SQL Server and Windows Authentication mode" is selected
- Restart SQL Server if you change this setting

### 3. Create the Database and Tables

- Run the initialization script located at:
  ```
  G:\Promco-2.0-Midas-Safety\backend\scripts\init-database.sql
  ```
- Verify the database and tables were created successfully
- Ensure the default admin user was created

### 4. Update .env File with Correct Credentials

```
DB_USER=your_actual_username
DB_PASSWORD=your_actual_password
DB_SERVER=your_actual_server_name
DB_DATABASE=MidasSafety
PORT=5000
JWT_SECRET=your_jwt_secret
```

Specifically:

- **For Windows Authentication**: 
  - DB_USER can be empty or your Windows username
  - DB_PASSWORD can be empty or your Windows password
  
- **For SQL Server Authentication**: 
  - Create a SQL login in SSMS
  - Grant necessary permissions to the login
  - Use those credentials in the .env file

### 5. Test the Connection Directly

Use this PowerShell command to test the connection directly:

```powershell
$connectionString = "Server=your_server_name;Database=MidasSafety;User Id=your_username;Password=your_password;"
$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
try {
    $connection.Open()
    Write-Host "Connection successful!"
    $connection.Close()
} catch {
    Write-Host "Connection failed: $_"
}
```

### 6. Development Workaround

Until the database connection is working:

1. The application will fall back to using local sample user data
2. You can log in with:
   - Email: admin@example.com
   - Password: adminpass

### 7. Common Error Messages and Solutions

- **Login failed for user**: Check username and password
- **Cannot open database requested**: Ensure database exists
- **Server not found**: Check server name and SQL Browser service
- **A network-related or instance-specific error**: Verify server name, SQL Server is running, firewall is not blocking connection

## Need More Help?

If you continue to experience issues, please:

1. Check the backend server logs
2. Verify your SQL Server configuration
3. Ensure the SQL Server port (default 1433) is not blocked by any firewall
