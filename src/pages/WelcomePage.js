// src/pages/WelcomePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  // Navigate to the login page when the button is clicked
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Welcome to Promco 2.0</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          We're excited to have you on board! Let's get started by logging in.
        </p>
        <button 
          onClick={goToLogin} 
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 transition duration-300"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
