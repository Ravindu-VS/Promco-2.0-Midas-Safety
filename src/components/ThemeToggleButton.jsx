import React, { useState, useEffect } from "react";
import "./ThemeToggleButton.css";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md"; // Icons for light and dark mode

const ThemeToggleButton = () => {
  // Default theme is light
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save the theme preference in localStorage
  };

  // Apply the theme to the body on mount and whenever theme changes
  useEffect(() => {
    document.body.className = theme + "-theme";
  }, [theme]);

  return (
    <div className="theme-toggle-container">
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === "light" ? (
          <MdOutlineDarkMode className="theme-icon" />
        ) : (
          <MdOutlineLightMode className="theme-icon" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggleButton;
