import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
import './ProfileMenu.css';

const ProfileMenu = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="profile-menu">
            <ul>
                <li><Link to="/profile" onClick={onClose}>Profile</Link></li>
                <li><Link to="/settings" onClick={onClose}>Settings</Link></li>
                <li onClick={onClose}>Logout</li>
            </ul>
        </div>
    );
};

export default ProfileMenu;
