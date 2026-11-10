import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { notificationsEnabled, setNotificationsEnabled } from '../services/notificationPrefs';
import './Settings.css';

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState(notificationsEnabled);

    const handleNotificationToggle = () => {
        const next = !notifications;
        setNotifications(next);
        setNotificationsEnabled(next);
    };

    return (
        <div className="settings-container">
            <h2 className="page-title">Settings</h2>
            <div className="settings-card">
                <div className="settings-item">
                    <label htmlFor="theme-select">Theme</label>
                    <select id="theme-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>

                <div className="settings-item">
                    <label htmlFor="notifications-toggle">
                        Check for notifications
                        <span className="settings-hint">
                            When on, the bell in the top bar checks for new notifications every 30 seconds.
                            Saved for your account in this browser.
                        </span>
                    </label>
                    <input
                        id="notifications-toggle"
                        type="checkbox"
                        checked={notifications}
                        onChange={handleNotificationToggle}
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
