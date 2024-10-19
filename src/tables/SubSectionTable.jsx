import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const SubSectionTable = () => {
  // Initial state for the form inputs and subsections list
  const [subSectionData, setSubSectionData] = useState({
    subSection: "",
    hasDeleted: false,
    createdTime: "",
    modifiedTime: "",
    plantDepId: "",
  });

  const [subSections, setSubSections] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the subsection being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const subSectionsPerPage = 10; // Number of subsections to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubSectionData({
      ...subSectionData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();

    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing subsection
      const updatedSubSections = subSections.map((subSection, index) => 
        index === editIndex 
          ? { ...subSectionData, modifiedTime: currentTime, createdTime: subSection.createdTime } 
          : subSection
      );
      setSubSections(updatedSubSections);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new subsection
      setSubSections([
        ...subSections,
        { 
          ...subSectionData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setSubSectionData({
      subSection: "",
      hasDeleted: false,
      createdTime: "",
      modifiedTime: "",
      plantDepId: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const subSectionToEdit = subSections[index];
    setSubSectionData(subSectionToEdit);
    setEditIndex(index); // Set the index to track which subsection is being edited
  };

  // Pagination functions
  const lastSubSectionIndex = currentPage * subSectionsPerPage;
  const firstSubSectionIndex = lastSubSectionIndex - subSectionsPerPage;
  const currentSubSections = subSections.slice(firstSubSectionIndex, lastSubSectionIndex);

  const totalPages = Math.ceil(subSections.length / subSectionsPerPage);

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
          <label>Sub Section:</label>
          <input
            type="text"
            name="subSection"
            value={subSectionData.subSection}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={subSectionData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Plant Department ID:</label>
          <input
            type="text"
            name="plantDepId"
            value={subSectionData.plantDepId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Sub Section" : "Add Sub Section"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>Sub Section</th>
            <th>Has Deleted</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Plant Department ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSubSections.map((subSection, index) => (
            <tr key={index}>
              <td>{subSection.subSection}</td>
              <td>{subSection.hasDeleted ? "Yes" : "No"}</td>
              <td>{new Date(subSection.createdTime).toLocaleString()}</td>
              <td>{new Date(subSection.modifiedTime).toLocaleString()}</td>
              <td>{subSection.plantDepId}</td>
              <td>
                <button onClick={() => handleEdit(firstSubSectionIndex + index)}>🖉 Edit</button>
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

export default SubSectionTable;
