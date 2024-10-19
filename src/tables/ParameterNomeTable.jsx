import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const ParameterNormTable = () => {
  // Initial state for the form inputs and parameter norms list
  const [parameterNormData, setParameterNormData] = useState({
    id: "",
    parameter: "",
    plantDepld: "",
    minValue: "",
    maxValue: "",
    nDateTime: "",
    hasDeleted: false,
  });

  const [parameterNorms, setParameterNorms] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the parameter norm being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const parameterNormsPerPage = 10; // Number of parameter norms to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParameterNormData({
      ...parameterNormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing parameter norm
      const updatedParameterNorms = parameterNorms.map((norm, index) => 
        index === editIndex 
          ? { ...parameterNormData, modifiedTime: currentTime, createdTime: norm.createdTime } 
          : norm
      );
      setParameterNorms(updatedParameterNorms);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new parameter norm
      setParameterNorms([
        ...parameterNorms,
        { 
          ...parameterNormData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setParameterNormData({
      id: "",
      parameter: "",
      plantDepld: "",
      minValue: "",
      maxValue: "",
      nDateTime: "",
      hasDeleted: false,
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const parameterNormToEdit = parameterNorms[index];
    setParameterNormData(parameterNormToEdit);
    setEditIndex(index); // Set the index to track which parameter norm is being edited
  };

  // Pagination functions
  const lastParameterNormIndex = currentPage * parameterNormsPerPage;
  const firstParameterNormIndex = lastParameterNormIndex - parameterNormsPerPage;
  const currentParameterNorms = parameterNorms.slice(firstParameterNormIndex, lastParameterNormIndex);

  const totalPages = Math.ceil(parameterNorms.length / parameterNormsPerPage);

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
            value={parameterNormData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Parameter:</label>
          <input
            type="text"
            name="parameter"
            value={parameterNormData.parameter}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Plant Depld:</label>
          <input
            type="text"
            name="plantDepld"
            value={parameterNormData.plantDepld}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Min Value:</label>
          <input
            type="number"
            name="minValue"
            value={parameterNormData.minValue}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Max Value:</label>
          <input
            type="number"
            name="maxValue"
            value={parameterNormData.maxValue}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>N Date Time:</label>
          <input
            type="datetime-local"
            name="nDateTime"
            value={parameterNormData.nDateTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={parameterNormData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Parameter Norm" : "Add Parameter Norm"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Parameter</th>
            <th>Plant Depld</th>
            <th>Min Value</th>
            <th>Max Value</th>
            <th>N Date Time</th>
            <th>Has Deleted</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentParameterNorms.map((norm, index) => (
            <tr key={index}>
              <td>{norm.id}</td>
              <td>{norm.parameter}</td>
              <td>{norm.plantDepld}</td>
              <td>{norm.minValue}</td>
              <td>{norm.maxValue}</td>
              <td>{new Date(norm.nDateTime).toLocaleString()}</td>
              <td>{norm.hasDeleted ? "Yes" : "No"}</td>
              <td>{new Date(norm.createdTime).toLocaleString()}</td>
              <td>{new Date(norm.modifiedTime).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(firstParameterNormIndex + index)}>🖉 Edit</button>
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

export default ParameterNormTable;
