import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const PlantDepartmentTable = () => {
  // Initial state for the form inputs and plant departments list
  const [plantDepartmentData, setPlantDepartmentData] = useState({
    id: "",
    plantId: "",
    departmentId: "",
    plantName: "",
    departmentName: "",
    hasDeleted: false,
  });

  const [plantDepartments, setPlantDepartments] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the plant department being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const plantDepartmentsPerPage = 10; // Number of plant departments to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlantDepartmentData({
      ...plantDepartmentData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();

    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing plant department
      const updatedPlantDepartments = plantDepartments.map((department, index) => 
        index === editIndex 
          ? { ...plantDepartmentData, modifiedTime: currentTime, createdTime: department.createdTime } 
          : department
      );
      setPlantDepartments(updatedPlantDepartments);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new plant department
      setPlantDepartments([
        ...plantDepartments,
        { 
          ...plantDepartmentData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setPlantDepartmentData({
      id: "",
      plantId: "",
      departmentId: "",
      plantName: "",
      departmentName: "",
      hasDeleted: false,
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const plantDepartmentToEdit = plantDepartments[index];
    setPlantDepartmentData(plantDepartmentToEdit);
    setEditIndex(index); // Set the index to track which plant department is being edited
  };

  // Pagination functions
  const lastPlantDepartmentIndex = currentPage * plantDepartmentsPerPage;
  const firstPlantDepartmentIndex = lastPlantDepartmentIndex - plantDepartmentsPerPage;
  const currentPlantDepartments = plantDepartments.slice(firstPlantDepartmentIndex, lastPlantDepartmentIndex);

  const totalPages = Math.ceil(plantDepartments.length / plantDepartmentsPerPage);

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
            value={plantDepartmentData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Plant ID:</label>
          <input
            type="text"
            name="plantId"
            value={plantDepartmentData.plantId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department ID:</label>
          <input
            type="text"
            name="departmentId"
            value={plantDepartmentData.departmentId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Plant Name:</label>
          <input
            type="text"
            name="plantName"
            value={plantDepartmentData.plantName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department Name:</label>
          <input
            type="text"
            name="departmentName"
            value={plantDepartmentData.departmentName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={plantDepartmentData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Plant Department" : "Add Plant Department"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plant ID</th>
            <th>Department ID</th>
            <th>Plant Name</th>
            <th>Department Name</th>
            <th>Has Deleted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPlantDepartments.map((department, index) => (
            <tr key={index}>
              <td>{department.id}</td>
              <td>{department.plantId}</td>
              <td>{department.departmentId}</td>
              <td>{department.plantName}</td>
              <td>{department.departmentName}</td>
              <td>{department.hasDeleted ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(firstPlantDepartmentIndex + index)}>🖉 Edit</button>
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

export default PlantDepartmentTable;
