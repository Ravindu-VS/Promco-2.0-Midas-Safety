import React from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { useTheme } from '../hooks/useTheme';
import "./ThemeToggleButton.css";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        title={theme === "light" ? "Dark mode" : "Light mode"}
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
