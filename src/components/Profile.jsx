import React from 'react';
import './Profile.css'; // Add custom CSS styles for the profile page

const Profile = ({ user }) => {
  if (!user) {
    return <div>No user data available.</div>; // Handle the case when user data is not available
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* Assuming user.profilePicture is optional */}
        {user.profilePicture && (
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
        )}
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
      </div>
      
      <div className="profile-details">
        <h2>Profile Details</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Joined:</strong> {new Date(user.joinedDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;
