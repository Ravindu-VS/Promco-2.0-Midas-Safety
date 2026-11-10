import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const NotFound = () => (
  <div className="relative z-10 flex flex-col justify-center items-center min-h-screen text-center px-6">
    <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
      The page you are looking for does not exist.
    </p>
    <Link
      to={isAuthenticated() ? '/dashboard' : '/'}
      className="px-6 py-3 rounded-md text-white bg-primary hover:opacity-90 transition"
    >
      {isAuthenticated() ? 'Back to Dashboard' : 'Back to Home'}
    </Link>
  </div>
);

export default NotFound;
