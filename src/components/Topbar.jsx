import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import '../components/Topbar.css'; // Import the CSS file

const Topbar = ({ show }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Sample user data
  const user = {
    name: 'John Doe',
    address: '123 Main St, Anytown',
    telephone: '+1 234 567 890',
    username: 'johndoe',
    email: 'john.doe@example.com',
    role: 'Admin',
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to profile page
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings'); // Navigate to settings page
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    // Perform logout logic here (e.g., clearing tokens)
    navigate('/'); // Redirect to login page
  };

  const isMenuOpen = Boolean(anchorEl);

  // Render null if show is false
  if (!show) return null;

  return (
    <div className="topbar">
      {/* Left - Logo */}
      <div className="topbar-left">
        <a href="https://www.midassafety.com/" target="_blank" rel="noopener noreferrer">
          <img
            src={`${process.env.PUBLIC_URL}/MIDAS-Logo12.png`}
            alt="Logo"
            className="logo"
          />
        </a>
      </div>

      {/* Right - Account Icon */}
      <div className="topbar-right">
        <IconButton onClick={handleProfileMenuOpen}>
          <AccountCircleIcon className="account-icon" />
        </IconButton>
      </div>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        <MenuItem onClick={handleSettingsClick}>Settings</MenuItem> {/* Updated here */}
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default Topbar;
