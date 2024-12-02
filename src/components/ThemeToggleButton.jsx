import React, { useEffect } from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md"; // Icons from react-icons
import { useTheme } from '../hooks/useTheme'; // Make sure the path is correct
import "./ThemeToggleButton.css"; // Add your styles for the button

const ThemeToggleButton = () => {
  // Get theme state and toggle function from useTheme hook
  const { theme, toggleTheme } = useTheme(); // This is the only theme state you need

  // Apply the theme to the body on mount and whenever the theme changes
  useEffect(() => {
    document.body.className = theme + "-theme"; // Apply the theme class
    localStorage.setItem("theme", theme); // Optionally, save the theme preference to localStorage
  }, [theme]);

  return (
    <div className="theme-toggle-container">
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
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
