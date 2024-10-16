import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import './index.css';
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter

// Render the App wrapped in Router
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router> {/* BrowserRouter wraps the whole app to enable routing */}
      <App />
    </Router>
  </StrictMode>
);
