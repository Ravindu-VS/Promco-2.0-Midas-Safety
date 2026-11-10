import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import NotificationBell from "./NotificationBell";
import '../components/Topbar.css';

const Topbar = ({ show }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ name: "", profilePicture: "" });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Reload on navigation and whenever the profile is saved
    const sync = () => {
      const storedUser = getCurrentUser();
      if (storedUser) setUser(storedUser);
    };
    sync();
    window.addEventListener('promco:user-updated', sync);
    return () => window.removeEventListener('promco:user-updated', sync);
  }, [location.pathname]);

  const getInitials = (name) =>
    name
      .split(/[\s_.-]+/)
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join('')
      .slice(0, 2);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logout(); // Clears both the token and the stored user
    navigate('/login', { replace: true });
  };

  const isMenuOpen = Boolean(anchorEl);

  if (!show) return null;

  return (
    <div className="topbar">
      {/* Left - Logo */}
      <div className="topbar-left">
        <a href="https://www.midassafety.com/" target="_blank" rel="noopener noreferrer">
        <img
          src={`${process.env.PUBLIC_URL}/logo-light.png`}
          alt="Light Mode Logo"
          className="logo logo-light" // Show only in light mode
        />
        <img
          src={`${process.env.PUBLIC_URL}/logo-dark.png`}
          alt="Dark Mode Logo"
          className="logo logo-dark" // Show only in dark mode
        />
        </a>
      </div>

      {/* Right - Profile Picture and Notification Icon */}
      <div className="topbar-right">
        {/* Notifications from the API */}
        <NotificationBell />

        {/* Profile Picture or Initials */}
        <IconButton onClick={handleProfileMenuOpen} aria-label="Account menu">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <Avatar className="profile-avatar">
              {getInitials(user.name || user.username || "User")}
            </Avatar>
          )}
        </IconButton>
      </div>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>

    </div>
  );
};

export default Topbar;
