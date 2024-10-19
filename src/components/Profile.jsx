import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar
import Topbar from '../components/Topbar'; // Import Topbar
import './Profile.css'; // Import the CSS file
import { FaPencilAlt } from 'react-icons/fa'; // Import pencil icon

const Profile = () => {
    // Initial user data from localStorage or default values
    const storedUser = JSON.parse(localStorage.getItem('user')) || {
        id: '123456',  // Example User ID
        profilePicture: 'https://via.placeholder.com/150',
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        telephone: '+1 234 567 890',
        role: 'Admin',  // Now role will be displayed instead of nickname
        address: '',
        dob: '',
        password: '********',
    };

    const [userData, setUserData] = useState(storedUser);

    useEffect(() => {
        // Load user data from localStorage when the component mounts
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserData(storedUser);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData((prevData) => ({
                    ...prevData,
                    profilePicture: reader.result,
                }));
                // Update localStorage with new profile picture
                const updatedUser = { ...userData, profilePicture: reader.result };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(userData));
        alert('Profile updated successfully!');
    };

    return (
        <div className="profile-container">
            {/* Sidebar */}
            <Sidebar profilePicture={userData.profilePicture} /> {/* Pass profile picture to Sidebar */}

            <div className="content">
                {/* Topbar */}
                <Topbar profilePicture={userData.profilePicture} /> {/* Pass profile picture to Topbar */}

                {/* Main Content */}
                <div className="main-content">
                    {/* Profile Section */}
                    <div className="profile-card">
                        <div className="profile-header">
                            {/* Profile Picture */}
                            <div className="profile-picture-section">
                                <img
                                    src={userData.profilePicture}
                                    alt="User Profile"
                                    className="profile-picture"
                                />
                                <div className="upload-section">
                                    <label className="upload-label" htmlFor="profile-picture">Change Picture</label>
                                    <input
                                        type="file"
                                        id="profile-picture"  // Add id to the input
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="upload-input"
                                    />
                                </div>
                            </div>

                            <div className="profile-name-section">
                                <h3>{userData.username}</h3>
                                <p>{userData.role}</p> {/* Display the role */}
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="profile-form">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>User ID</td> {/* Added User ID Row */}
                                        <td>
                                            <input
                                                type="text"
                                                name="id"
                                                value={userData.id}
                                                readOnly
                                                className="profile-input"
                                            />
                                        </td>
                                        <td><FaPencilAlt className="edit-icon disabled" /></td>
                                    </tr>
                                    <tr>
                                        <td>Username</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="username"
                                                value={userData.username}
                                                onChange={handleInputChange}
                                                className="profile-input"
                                            />
                                        </td>
                                        <td><FaPencilAlt className="edit-icon" /></td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>
                                            <input
                                                type="email"
                                                name="email"
                                                value={userData.email}
                                                readOnly
                                                className="profile-input"
                                            />
                                        </td>
                                        <td><FaPencilAlt className="edit-icon disabled" /></td>
                                    </tr>
                                    <tr>
                                        <td>Telephone</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="telephone"
                                                value={userData.telephone}
                                                onChange={handleInputChange}
                                                className="profile-input"
                                            />
                                        </td>
                                        <td><FaPencilAlt className="edit-icon" /></td>
                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="address"
                                                value={userData.address}
                                                onChange={handleInputChange}
                                                className="profile-input"
                                            />
                                        </td>
                                        <td><FaPencilAlt className="edit-icon" /></td>
                                    </tr>
                                    <tr>
                                        <td>Role</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="role"
                                                value={userData.role}
                                                readOnly
                                                className="profile-input"
                                            />
                                        </td>
                                        <td><FaPencilAlt className="edit-icon disabled" /></td>
                                    </tr>
                                    <tr>
                                        <td>Date of Birth</td>
                                        <td>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={userData.dob}
                                                onChange={handleInputChange}
                                                className="profile-input"
                                            />
                                        </td>
                                        <td><FaPencilAlt className="edit-icon" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <button onClick={handleSaveChanges} className="save-button">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
