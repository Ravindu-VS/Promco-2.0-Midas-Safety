// src/pages/WelcomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative z-10 flex justify-center items-center min-h-screen px-6">
      <div className="text-center max-w-2xl">
        <img
          src={`${process.env.PUBLIC_URL}/logo-light.png`}
          alt="Midas Safety"
          className="logo logo-light mx-auto mb-8 w-40"
        />
        <img
          src={`${process.env.PUBLIC_URL}/logo-dark.png`}
          alt="Midas Safety"
          className="logo logo-dark mx-auto mb-8 w-40"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to <span className="text-primary">Promco 2.0</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Register machines, report faults, schedule maintenance and keep plant master
          data in one place. Sign in to get started.
        </p>
        <button
          type="button"
          onClick={goToLogin}
          className="px-8 py-3 bg-primary text-white text-lg rounded-md shadow-lg hover:opacity-90 transition duration-300"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
