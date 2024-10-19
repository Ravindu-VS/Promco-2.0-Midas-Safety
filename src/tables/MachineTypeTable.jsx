import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const MachineTypeTable = () => {
  // Initial state for the form inputs and machine types list
  const [machineTypeData, setMachineTypeData] = useState({
    machineType: "",
    hasDeleted: false,
    plantDepld: "",
  });

  const [machineTypes, setMachineTypes] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the machine type being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const machineTypesPerPage = 10; // Number of machine types to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMachineTypeData({
      ...machineTypeData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing machine type
      const updatedMachineTypes = machineTypes.map((machineType, index) => 
        index === editIndex 
          ? { ...machineTypeData, modifiedTime: currentTime, createdTime: machineType.createdTime } 
          : machineType
      );
      setMachineTypes(updatedMachineTypes);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new machine type
      setMachineTypes([
        ...machineTypes,
        { 
          ...machineTypeData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setMachineTypeData({
      machineType: "",
      hasDeleted: false,
      plantDepld: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const machineTypeToEdit = machineTypes[index];
    setMachineTypeData(machineTypeToEdit);
    setEditIndex(index); // Set the index to track which machine type is being edited
  };

  // Pagination functions
  const lastMachineTypeIndex = currentPage * machineTypesPerPage;
  const firstMachineTypeIndex = lastMachineTypeIndex - machineTypesPerPage;
  const currentMachineTypes = machineTypes.slice(firstMachineTypeIndex, lastMachineTypeIndex);

  const totalPages = Math.ceil(machineTypes.length / machineTypesPerPage);

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
          <label>Machine Type:</label>
          <input
            type="text"
            name="machineType"
            value={machineTypeData.machineType}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={machineTypeData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Plant Depld:</label>
          <input
            type="text"
            name="plantDepld"
            value={machineTypeData.plantDepld}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Machine Type" : "Add Machine Type"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>Machine Type</th>
            <th>Has Deleted</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Plant Depld</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMachineTypes.map((machineType, index) => (
            <tr key={index}>
              <td>{machineType.machineType}</td>
              <td>{machineType.hasDeleted ? "Yes" : "No"}</td>
              <td>{new Date(machineType.createdTime).toLocaleString()}</td>
              <td>{new Date(machineType.modifiedTime).toLocaleString()}</td>
              <td>{machineType.plantDepld}</td>
              <td>
                <button onClick={() => handleEdit(firstMachineTypeIndex + index)}>🖉 Edit</button>
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

export default MachineTypeTable;
