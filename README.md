# Promco 2.0 - Midas Safety Web Application

🚀 Digitizing Industrial Maintenance – A comprehensive web application for managing machine maintenance in large-scale manufacturing.

## Project Overview

This application helps Midas Safety, a global glove manufacturer, streamline their fault reporting and maintenance tracking processes. It transitions from manual logs to a smart digital system, significantly improving efficiency and response times.

## Key Features

- **Machine Data Management** – Organized and stored machine details.
- **Fault Reporting System** – Instant issue reporting for faster maintenance.
- **Real-Time Dashboard** – Live updates on reported faults and repairs.
- **User Role Management** – Controlled data access for security.
- **Data Analytics & Reports** – Identified recurring issues for proactive maintenance.

## Tech Stack

### Frontend
- React.js
- Material UI
- Chart.js
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT) for authentication

### Database
- Microsoft SQL Server (MSSQL)

## Project Structure

The project is organized into two main directories:

```
/frontend   # React application
/backend    # Node.js + Express API server
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- Microsoft SQL Server
- npm or yarn

### Setting Up the Database

1. Create a database in MSSQL
2. Run the SQL script in `/backend/scripts/init-database.sql`

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DB_USER=your_mssql_username
   DB_PASSWORD=your_mssql_password
   DB_SERVER=your_server_address
   DB_DATABASE=MidasSafety
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/register` - Register new user (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Machines
- `GET /api/machines` - Get all machines
- `GET /api/machines/:id` - Get machine by ID
- `POST /api/machines` - Create machine
- `PUT /api/machines/:id` - Update machine
- `DELETE /api/machines/:id` - Delete machine (admin only)
- `GET /api/machines/:id/maintenance` - Get machine maintenance history
- `POST /api/machines/:id/faults` - Report a fault for a machine

### Parameters
- `GET /api/parameters` - Get all parameters
- `GET /api/parameters/:id` - Get parameter by ID
- `POST /api/parameters` - Create parameter
- `PUT /api/parameters/:id` - Update parameter
- `DELETE /api/parameters/:id` - Delete parameter (admin only)
- `GET /api/parameters/:id/qualified-values` - Get parameter qualified values

## Team Members

- Ravindu Vinusha
- Rumeth Jayasinghe
- Gimhani Tharushika
- Rashmi Rathnayaka

## Project Timeline

January 2024 - December 2024
