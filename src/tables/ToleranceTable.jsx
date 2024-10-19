import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const ToleranceTable = () => {
  // Initial state for the form inputs and tolerances list
  const [toleranceData, setToleranceData] = useState({
    id: "",
    hasDeleted: false,
    name: "",
    type: "",
    creatorId: "",
    modifiedId: "",
    createdTime: "",
    modifiedTime: "",
    plantDepId: "",
  });

  const [tolerances, setTolerances] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the tolerance being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const tolerancesPerPage = 10; // Number of tolerances to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setToleranceData({
      ...toleranceData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();

    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing tolerance
      const updatedTolerances = tolerances.map((tolerance, index) => 
        index === editIndex 
          ? { ...toleranceData, modifiedTime: currentTime, createdTime: tolerance.createdTime } 
          : tolerance
      );
      setTolerances(updatedTolerances);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new tolerance
      setTolerances([
        ...tolerances,
        { 
          ...toleranceData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setToleranceData({
      id: "",
      hasDeleted: false,
      name: "",
      type: "",
      creatorId: "",
      modifiedId: "",
      createdTime: "",
      modifiedTime: "",
      plantDepId: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const toleranceToEdit = tolerances[index];
    setToleranceData(toleranceToEdit);
    setEditIndex(index); // Set the index to track which tolerance is being edited
  };

  // Pagination functions
  const lastToleranceIndex = currentPage * tolerancesPerPage;
  const firstToleranceIndex = lastToleranceIndex - tolerancesPerPage;
  const currentTolerances = tolerances.slice(firstToleranceIndex, lastToleranceIndex);

  const totalPages = Math.ceil(tolerances.length / tolerancesPerPage);

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
            value={toleranceData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={toleranceData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={toleranceData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={toleranceData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Creator ID:</label>
          <input
            type="text"
            name="creatorId"
            value={toleranceData.creatorId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Modified ID:</label>
          <input
            type="text"
            name="modifiedId"
            value={toleranceData.modifiedId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Plant Department ID:</label>
          <input
            type="text"
            name="plantDepId"
            value={toleranceData.plantDepId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Tolerance" : "Add Tolerance"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Has Deleted</th>
            <th>Name</th>
            <th>Type</th>
            <th>Creator ID</th>
            <th>Modified ID</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Plant Department ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTolerances.map((tolerance, index) => (
            <tr key={index}>
              <td>{tolerance.id}</td>
              <td>{tolerance.hasDeleted ? "Yes" : "No"}</td>
              <td>{tolerance.name}</td>
              <td>{tolerance.type}</td>
              <td>{tolerance.creatorId}</td>
              <td>{tolerance.modifiedId}</td>
              <td>{new Date(tolerance.createdTime).toLocaleString()}</td>
              <td>{new Date(tolerance.modifiedTime).toLocaleString()}</td>
              <td>{tolerance.plantDepId}</td>
              <td>
                <button onClick={() => handleEdit(firstToleranceIndex + index)}>🖉 Edit</button>
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

export default ToleranceTable;
