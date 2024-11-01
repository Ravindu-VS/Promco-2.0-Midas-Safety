import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Badge, Avatar } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import '../components/Topbar.css';

const Topbar = ({ show }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    "New message from admin",
    "System maintenance scheduled",
    "Task completed successfully"
  ]);
  const [user, setUser] = useState({ name: "", profilePicture: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getInitials = (name) => {
    const initials = name.split(' ')
      .map((word) => word[0].toUpperCase())
      .join('');
    return initials;
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
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
    localStorage.removeItem("user"); // Clear user data
    navigate('/'); // Redirect to login page
  };

  const handleNotificationViewed = (index) => {
    setNotifications(prevNotifications => prevNotifications.filter((_, i) => i !== index));
    handleNotificationClose();
  };

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationOpen = Boolean(notificationAnchorEl);

  if (!show) return null;

  return (
    <div className="topbar">
      {/* Left - Logo */}
      <div className="topbar-left">
        <a href="https://www.midassafety.com/" target="_blank" rel="noopener noreferrer">
          <img
            src={`${process.env.PUBLIC_URL}/logo-light.png`}
            alt="Logo"
            className="logo"
          />
        </a>
      </div>

      {/* Right - Profile Picture and Notification Icon */}
      <div className="topbar-right">
        {/* Notification Icon */}
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon className="notification-icon" />
          </Badge>
        </IconButton>

        {/* Profile Picture or Initials */}
        <IconButton onClick={handleProfileMenuOpen}>
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <Avatar className="profile-avatar">
              {getInitials(user.name || "User")}
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
          vertical: "top",
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

      {/* Notification Dropdown Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={isNotificationOpen}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={() => handleNotificationViewed(index)}>
              {notification}
            </MenuItem>
          ))
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default Topbar;
