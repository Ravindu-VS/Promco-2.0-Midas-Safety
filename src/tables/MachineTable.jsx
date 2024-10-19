import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const Machine = () => {
  // Initial state for the form inputs and machines list
  const [machineData, setMachineData] = useState({
    machine: "",
    machineType: "",
    sapResource: "",
    hasDeleted: false,
    plantDepld: "",
  });

  const [machines, setMachines] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the machine being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const machinesPerPage = 10; // Number of machines to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMachineData({
      ...machineData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing machine
      const updatedMachines = machines.map((machine, index) => 
        index === editIndex 
          ? { ...machineData, modifiedTime: currentTime, createdTime: machine.createdTime } 
          : machine
      );
      setMachines(updatedMachines);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new machine
      setMachines([
        ...machines,
        { 
          ...machineData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setMachineData({
      machine: "",
      machineType: "",
      sapResource: "",
      hasDeleted: false,
      plantDepld: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const machineToEdit = machines[index];
    setMachineData(machineToEdit);
    setEditIndex(index); // Set the index to track which machine is being edited
  };

  // Pagination functions
  const lastMachineIndex = currentPage * machinesPerPage;
  const firstMachineIndex = lastMachineIndex - machinesPerPage;
  const currentMachines = machines.slice(firstMachineIndex, lastMachineIndex);

  const totalPages = Math.ceil(machines.length / machinesPerPage);

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
          <label>Machine:</label>
          <input
            type="text"
            name="machine"
            value={machineData.machine}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Machine Type:</label>
          <input
            type="text"
            name="machineType"
            value={machineData.machineType}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>SAP Resource:</label>
          <input
            type="text"
            name="sapResource"
            value={machineData.sapResource}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={machineData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Plant Depld:</label>
          <input
            type="text"
            name="plantDepld"
            value={machineData.plantDepld}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Machine" : "Add Machine"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>Machine</th>
            <th>Machine Type</th>
            <th>SAP Resource</th>
            <th>Has Deleted</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Plant Depld</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMachines.map((machine, index) => (
            <tr key={index}>
              <td>{machine.machine}</td>
              <td>{machine.machineType}</td>
              <td>{machine.sapResource}</td>
              <td>{machine.hasDeleted ? "Yes" : "No"}</td>
              <td>{new Date(machine.createdTime).toLocaleString()}</td>
              <td>{new Date(machine.modifiedTime).toLocaleString()}</td>
              <td>{machine.plantDepld}</td>
              <td>
                <button onClick={() => handleEdit(firstMachineIndex + index)}>🖉 Edit</button>
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

export default Machine;
