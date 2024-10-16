import React, { useState } from 'react';
import './Settings.css'; // Import your CSS for styling

const Settings = () => {
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState(true);

    const handleThemeChange = (e) => {
        setTheme(e.target.value);
    };

    const handleNotificationToggle = () => {
        setNotifications(!notifications);
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-item">
                <label htmlFor="theme-select">Theme:</label>
                <select id="theme-select" value={theme} onChange={handleThemeChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            <div className="settings-item">
                <label htmlFor="notifications-toggle">Enable Notifications:</label>
                <input
                    id="notifications-toggle"
                    type="checkbox"
                    checked={notifications}
                    onChange={handleNotificationToggle}
                />
            </div>
        </div>
    );
};

export default Settings;
