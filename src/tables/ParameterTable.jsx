import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const ParameterTable = () => {
  // Initial state for the form inputs and parameter list
  const [parameterData, setParameterData] = useState({
    parameter: "",
    hasDeleted: false,
    plantDepld: "",
  });

  const [parameters, setParameters] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the parameter being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const parametersPerPage = 10; // Number of parameters to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParameterData({
      ...parameterData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing parameter
      const updatedParameters = parameters.map((parameter, index) => 
        index === editIndex 
          ? { ...parameterData, modifiedTime: currentTime, createdTime: parameter.createdTime } 
          : parameter
      );
      setParameters(updatedParameters);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new parameter
      setParameters([
        ...parameters,
        { 
          ...parameterData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setParameterData({
      parameter: "",
      hasDeleted: false,
      plantDepld: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const parameterToEdit = parameters[index];
    setParameterData(parameterToEdit);
    setEditIndex(index); // Set the index to track which parameter is being edited
  };

  // Pagination functions
  const lastParameterIndex = currentPage * parametersPerPage;
  const firstParameterIndex = lastParameterIndex - parametersPerPage;
  const currentParameters = parameters.slice(firstParameterIndex, lastParameterIndex);

  const totalPages = Math.ceil(parameters.length / parametersPerPage);

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
          <label>Parameter:</label>
          <input
            type="text"
            name="parameter"
            value={parameterData.parameter}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={parameterData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Plant Depld:</label>
          <input
            type="text"
            name="plantDepld"
            value={parameterData.plantDepld}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Parameter" : "Add Parameter"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Has Deleted</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Plant Depld</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentParameters.map((parameter, index) => (
            <tr key={index}>
              <td>{parameter.parameter}</td>
              <td>{parameter.hasDeleted ? "Yes" : "No"}</td>
              <td>{new Date(parameter.createdTime).toLocaleString()}</td>
              <td>{new Date(parameter.modifiedTime).toLocaleString()}</td>
              <td>{parameter.plantDepld}</td>
              <td>
                <button onClick={() => handleEdit(firstParameterIndex + index)}>🖉 Edit</button>
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

export default ParameterTable;
