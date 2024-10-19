import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const MaterialCodeTable = () => {
  // Initial state for the form inputs and material codes list
  const [materialCodeData, setMaterialCodeData] = useState({
    materialCode: "",
    hasDeleted: false,
    plantDepld: "",
  });

  const [materialCodes, setMaterialCodes] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the material code being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const materialCodesPerPage = 10; // Number of material codes to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMaterialCodeData({
      ...materialCodeData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing material code
      const updatedMaterialCodes = materialCodes.map((materialCode, index) => 
        index === editIndex 
          ? { ...materialCodeData, modifiedTime: currentTime, createdTime: materialCode.createdTime } 
          : materialCode
      );
      setMaterialCodes(updatedMaterialCodes);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new material code
      setMaterialCodes([
        ...materialCodes,
        { 
          ...materialCodeData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setMaterialCodeData({
      materialCode: "",
      hasDeleted: false,
      plantDepld: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const materialCodeToEdit = materialCodes[index];
    setMaterialCodeData(materialCodeToEdit);
    setEditIndex(index); // Set the index to track which material code is being edited
  };

  // Pagination functions
  const lastMaterialCodeIndex = currentPage * materialCodesPerPage;
  const firstMaterialCodeIndex = lastMaterialCodeIndex - materialCodesPerPage;
  const currentMaterialCodes = materialCodes.slice(firstMaterialCodeIndex, lastMaterialCodeIndex);

  const totalPages = Math.ceil(materialCodes.length / materialCodesPerPage);

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
          <label>Material Code:</label>
          <input
            type="text"
            name="materialCode"
            value={materialCodeData.materialCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={materialCodeData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Plant Depld:</label>
          <input
            type="text"
            name="plantDepld"
            value={materialCodeData.plantDepld}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Material Code" : "Add Material Code"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>Material Code</th>
            <th>Has Deleted</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Plant Depld</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMaterialCodes.map((materialCode, index) => (
            <tr key={index}>
              <td>{materialCode.materialCode}</td>
              <td>{materialCode.hasDeleted ? "Yes" : "No"}</td>
              <td>{new Date(materialCode.createdTime).toLocaleString()}</td>
              <td>{new Date(materialCode.modifiedTime).toLocaleString()}</td>
              <td>{materialCode.plantDepld}</td>
              <td>
                <button onClick={() => handleEdit(firstMaterialCodeIndex + index)}>🖉 Edit</button>
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

export default MaterialCodeTable;
