import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const MainSectionTable = () => {
  // Initial state for the form inputs and main sections list
  const [mainSectionData, setMainSectionData] = useState({
    mainSection: "",
    mainSectionName: "",
    hasDeleted: false,
    plantDepld: "",
  });

  const [mainSections, setMainSections] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the main section being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const mainSectionsPerPage = 10; // Number of main sections to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMainSectionData({
      ...mainSectionData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing main section
      const updatedMainSections = mainSections.map((mainSection, index) => 
        index === editIndex 
          ? { ...mainSectionData, modifiedTime: currentTime, createdTime: mainSection.createdTime } 
          : mainSection
      );
      setMainSections(updatedMainSections);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new main section
      setMainSections([
        ...mainSections,
        { 
          ...mainSectionData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setMainSectionData({
      mainSection: "",
      mainSectionName: "",
      hasDeleted: false,
      plantDepld: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const mainSectionToEdit = mainSections[index];
    setMainSectionData(mainSectionToEdit);
    setEditIndex(index); // Set the index to track which main section is being edited
  };

  // Pagination functions
  const lastMainSectionIndex = currentPage * mainSectionsPerPage;
  const firstMainSectionIndex = lastMainSectionIndex - mainSectionsPerPage;
  const currentMainSections = mainSections.slice(firstMainSectionIndex, lastMainSectionIndex);

  const totalPages = Math.ceil(mainSections.length / mainSectionsPerPage);

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
          <label>Main Section:</label>
          <input
            type="text"
            name="mainSection"
            value={mainSectionData.mainSection}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Main Section Name:</label>
          <input
            type="text"
            name="mainSectionName"
            value={mainSectionData.mainSectionName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={mainSectionData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Plant Depld:</label>
          <input
            type="text"
            name="plantDepld"
            value={mainSectionData.plantDepld}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Main Section" : "Add Main Section"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>Main Section</th>
            <th>Main Section Name</th>
            <th>Has Deleted</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Plant Depld</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMainSections.map((mainSection, index) => (
            <tr key={index}>
              <td>{mainSection.mainSection}</td>
              <td>{mainSection.mainSectionName}</td>
              <td>{mainSection.hasDeleted ? "Yes" : "No"}</td>
              <td>{new Date(mainSection.createdTime).toLocaleString()}</td>
              <td>{new Date(mainSection.modifiedTime).toLocaleString()}</td>
              <td>{mainSection.plantDepld}</td>
              <td>
                <button onClick={() => handleEdit(firstMainSectionIndex + index)}>🖉 Edit</button>
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

export default MainSectionTable;
