import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar
import Topbar from '../components/Topbar'; // Import Topbar
import './Profile.css'; // Import the CSS file

const Profile = () => {
    const [userData, setUserData] = useState({
        profilePicture: 'https://via.placeholder.com/150',
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        telephone: '+1 234 567 890',
        role: 'Admin',
    });

    const [users, setUsers] = useState([
        {
            username: 'JaneSmith',
            email: 'jane.smith@example.com',
            telephone: '+1 345 678 901',
            role: 'Operator',
        },
        {
            username: 'MikeJohnson',
            email: 'mike.johnson@example.com',
            telephone: '+1 456 789 012',
            role: 'Admin',
        },
        {
            username: 'SaraLee',
            email: 'sara.lee@example.com',
            telephone: '+1 567 890 123',
            role: 'Operator',
        },
    ]);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData((prevData) => ({
                    ...prevData,
                    profilePicture: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-container">
            {/* Sidebar */}
            <Sidebar />

            <div className="content">
                {/* Topbar */}
                <Topbar />

                {/* Main Content */}
                <div className="main-content">
                    {/* User Management Section */}
                    <div className="grid-container">
                        {/* Profile Section */}
                        <div className="profile-card">
                            <div className="profile-details">
                                {/* Profile Picture */}
                                <img
                                    src={userData.profilePicture}
                                    alt="User Profile"
                                    className="profile-picture"
                                />
                                {/* User Info */}
                                <div className="user-info">
                                    <h3>{userData.username}</h3>
                                    <p>{userData.email}</p>
                                    <p>{userData.telephone}</p>
                                    <p>{userData.role}</p>
                                </div>
                            </div>
                            {/* File Input for Profile Picture Upload */}
                            <div className="upload-section">
                                <label>Upload Profile Picture:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                    className="upload-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
