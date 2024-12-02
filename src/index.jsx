import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter to enable routing
import './index.css'; // Ensure Tailwind CSS is correctly imported
import App from './App'; // Import the main App component

// Create the root element and render the app inside the 'root' div
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap your app with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
