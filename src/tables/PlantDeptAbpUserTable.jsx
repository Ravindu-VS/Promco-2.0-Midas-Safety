import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const PlantDeptAbpUserTable = () => {
  // Initial state for the form inputs and plant department ABP users list
  const [plantDeptAbpUserData, setPlantDeptAbpUserData] = useState({
    id: "",
    AbpUserId: "",
    plantDeptId: "",
  });

  const [plantDeptAbpUsers, setPlantDeptAbpUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the plant department ABP user being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const plantDeptAbpUsersPerPage = 10; // Number of plant department ABP users to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlantDeptAbpUserData({
      ...plantDeptAbpUserData,
      [name]: value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Editing an existing plant department ABP user
      const updatedPlantDeptAbpUsers = plantDeptAbpUsers.map((user, index) => 
        index === editIndex 
          ? { ...plantDeptAbpUserData } 
          : user
      );
      setPlantDeptAbpUsers(updatedPlantDeptAbpUsers);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new plant department ABP user
      setPlantDeptAbpUsers([
        ...plantDeptAbpUsers,
        { 
          ...plantDeptAbpUserData,
        }
      ]);
    }

    // Reset the form after submission
    setPlantDeptAbpUserData({
      id: "",
      AbpUserId: "",
      plantDeptId: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const plantDeptAbpUserToEdit = plantDeptAbpUsers[index];
    setPlantDeptAbpUserData(plantDeptAbpUserToEdit);
    setEditIndex(index); // Set the index to track which plant department ABP user is being edited
  };

  // Pagination functions
  const lastPlantDeptAbpUserIndex = currentPage * plantDeptAbpUsersPerPage;
  const firstPlantDeptAbpUserIndex = lastPlantDeptAbpUserIndex - plantDeptAbpUsersPerPage;
  const currentPlantDeptAbpUsers = plantDeptAbpUsers.slice(firstPlantDeptAbpUserIndex, lastPlantDeptAbpUserIndex);

  const totalPages = Math.ceil(plantDeptAbpUsers.length / plantDeptAbpUsersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      {/* Form section */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={plantDeptAbpUserData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ABP User ID:</label>
          <input
            type="text"
            name="AbpUserId"
            value={plantDeptAbpUserData.AbpUserId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Plant Department ID:</label>
          <input
            type="text"
            name="plantDeptId"
            value={plantDeptAbpUserData.plantDeptId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Plant Dept ABP User" : "Add Plant Dept ABP User"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>ABP User ID</th>
            <th>Plant Department ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPlantDeptAbpUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.id}</td>
              <td>{user.AbpUserId}</td>
              <td>{user.plantDeptId}</td>
              <td>
                <button onClick={() => handleEdit(firstPlantDeptAbpUserIndex + index)}>🖉 Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PlantDeptAbpUserTable;
