import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const ShiftTable = () => {
  // Initial state for the form inputs and shifts list
  const [shiftData, setShiftData] = useState({
    shift: "",
    plantDepId: "",
    hasDeleted: false,
    createdTime: "",
    modifiedTime: "",
  });

  const [shifts, setShifts] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the shift being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const shiftsPerPage = 10; // Number of shifts to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShiftData({
      ...shiftData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();

    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing shift
      const updatedShifts = shifts.map((shift, index) => 
        index === editIndex 
          ? { ...shiftData, modifiedTime: currentTime, createdTime: shift.createdTime } 
          : shift
      );
      setShifts(updatedShifts);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new shift
      setShifts([
        ...shifts,
        { 
          ...shiftData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setShiftData({
      shift: "",
      plantDepId: "",
      hasDeleted: false,
      createdTime: "",
      modifiedTime: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const shiftToEdit = shifts[index];
    setShiftData(shiftToEdit);
    setEditIndex(index); // Set the index to track which shift is being edited
  };

  // Pagination functions
  const lastShiftIndex = currentPage * shiftsPerPage;
  const firstShiftIndex = lastShiftIndex - shiftsPerPage;
  const currentShifts = shifts.slice(firstShiftIndex, lastShiftIndex);

  const totalPages = Math.ceil(shifts.length / shiftsPerPage);

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
          <label>Shift:</label>
          <input
            type="text"
            name="shift"
            value={shiftData.shift}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Plant Department ID:</label>
          <input
            type="text"
            name="plantDepId"
            value={shiftData.plantDepId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={shiftData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Shift" : "Add Shift"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>Shift</th>
            <th>Plant Department ID</th>
            <th>Has Deleted</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentShifts.map((shift, index) => (
            <tr key={index}>
              <td>{shift.shift}</td>
              <td>{shift.plantDepId}</td>
              <td>{shift.hasDeleted ? "Yes" : "No"}</td>
              <td>{new Date(shift.createdTime).toLocaleString()}</td>
              <td>{new Date(shift.modifiedTime).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(firstShiftIndex + index)}>🖉 Edit</button>
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

export default ShiftTable;
