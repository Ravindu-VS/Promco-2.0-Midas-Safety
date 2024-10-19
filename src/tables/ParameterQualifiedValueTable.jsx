import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const ParameterQualifiedValueTable = () => {
  // Initial state for the form inputs and parameter qualified values list
  const [parameterQualifiedValueData, setParameterQualifiedValueData] = useState({
    id: "",
    plantDepld: "",
    materialCode: "",
    parameter: "",
    minValue: "",
    target: "",
    maxValue: "",
  });

  const [parameterQualifiedValues, setParameterQualifiedValues] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the parameter qualified value being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const parameterQualifiedValuesPerPage = 10; // Number of parameter qualified values to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParameterQualifiedValueData({
      ...parameterQualifiedValueData,
      [name]: value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing parameter qualified value
      const updatedParameterQualifiedValues = parameterQualifiedValues.map((value, index) => 
        index === editIndex 
          ? { ...parameterQualifiedValueData, modifiedTime: currentTime, createdTime: value.createdTime } 
          : value
      );
      setParameterQualifiedValues(updatedParameterQualifiedValues);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new parameter qualified value
      setParameterQualifiedValues([
        ...parameterQualifiedValues,
        { 
          ...parameterQualifiedValueData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setParameterQualifiedValueData({
      id: "",
      plantDepld: "",
      materialCode: "",
      parameter: "",
      minValue: "",
      target: "",
      maxValue: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const parameterQualifiedValueToEdit = parameterQualifiedValues[index];
    setParameterQualifiedValueData(parameterQualifiedValueToEdit);
    setEditIndex(index); // Set the index to track which parameter qualified value is being edited
  };

  // Pagination functions
  const lastParameterQualifiedValueIndex = currentPage * parameterQualifiedValuesPerPage;
  const firstParameterQualifiedValueIndex = lastParameterQualifiedValueIndex - parameterQualifiedValuesPerPage;
  const currentParameterQualifiedValues = parameterQualifiedValues.slice(firstParameterQualifiedValueIndex, lastParameterQualifiedValueIndex);

  const totalPages = Math.ceil(parameterQualifiedValues.length / parameterQualifiedValuesPerPage);

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
            value={parameterQualifiedValueData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Plant Depld:</label>
          <input
            type="text"
            name="plantDepld"
            value={parameterQualifiedValueData.plantDepld}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Material Code:</label>
          <input
            type="text"
            name="materialCode"
            value={parameterQualifiedValueData.materialCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Parameter:</label>
          <input
            type="text"
            name="parameter"
            value={parameterQualifiedValueData.parameter}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Min Value:</label>
          <input
            type="number"
            name="minValue"
            value={parameterQualifiedValueData.minValue}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Value:</label>
          <input
            type="number"
            name="target"
            value={parameterQualifiedValueData.target}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Max Value:</label>
          <input
            type="number"
            name="maxValue"
            value={parameterQualifiedValueData.maxValue}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Parameter Qualified Value" : "Add Parameter Qualified Value"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plant Depld</th>
            <th>Material Code</th>
            <th>Parameter</th>
            <th>Min Value</th>
            <th>Target Value</th>
            <th>Max Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentParameterQualifiedValues.map((value, index) => (
            <tr key={index}>
              <td>{value.id}</td>
              <td>{value.plantDepld}</td>
              <td>{value.materialCode}</td>
              <td>{value.parameter}</td>
              <td>{value.minValue}</td>
              <td>{value.target}</td>
              <td>{value.maxValue}</td>
              <td>
                <button onClick={() => handleEdit(firstParameterQualifiedValueIndex + index)}>🖉 Edit</button>
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

export default ParameterQualifiedValueTable;
