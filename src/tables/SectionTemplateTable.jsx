import React, { useState } from "react";
import './Table.css'; // Import the CSS file

const SectionTemplateTable = () => {
  // Initial state for the form inputs and section templates list
  const [sectionTemplateData, setSectionTemplateData] = useState({
    id: "",
    mainSection: "",
    subSection: "",
    machineType: "",
    parameter: "",
    toleranceId: "",
    threshold: "",
    hasDeleted: false,
    creatorId: "",
    modifiedId: "",
    createdTime: "",
    modifiedTime: "",
    plantDepId: "",
    parameterShortName: "",
    sortNumber: "",
    isDynamic: false,
    equation: "",
  });

  const [sectionTemplates, setSectionTemplates] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the section template being edited
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const sectionTemplatesPerPage = 10; // Number of section templates to display per page

  // Function to handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSectionTemplateData({
      ...sectionTemplateData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to handle form submission (adding or editing)
  const handleSubmit = (e) => {
    e.preventDefault();

    const currentTime = new Date().toISOString(); // Get current time in ISO format

    if (editIndex !== null) {
      // Editing an existing section template
      const updatedSectionTemplates = sectionTemplates.map((template, index) => 
        index === editIndex 
          ? { ...sectionTemplateData, modifiedTime: currentTime, createdTime: template.createdTime } 
          : template
      );
      setSectionTemplates(updatedSectionTemplates);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding a new section template
      setSectionTemplates([
        ...sectionTemplates,
        { 
          ...sectionTemplateData,
          createdTime: currentTime,
          modifiedTime: currentTime 
        }
      ]);
    }

    // Reset the form after submission
    setSectionTemplateData({
      id: "",
      mainSection: "",
      subSection: "",
      machineType: "",
      parameter: "",
      toleranceId: "",
      threshold: "",
      hasDeleted: false,
      creatorId: "",
      modifiedId: "",
      createdTime: "",
      modifiedTime: "",
      plantDepId: "",
      parameterShortName: "",
      sortNumber: "",
      isDynamic: false,
      equation: "",
    });
  };

  // Function to handle edit
  const handleEdit = (index) => {
    const sectionTemplateToEdit = sectionTemplates[index];
    setSectionTemplateData(sectionTemplateToEdit);
    setEditIndex(index); // Set the index to track which section template is being edited
  };

  // Pagination functions
  const lastSectionTemplateIndex = currentPage * sectionTemplatesPerPage;
  const firstSectionTemplateIndex = lastSectionTemplateIndex - sectionTemplatesPerPage;
  const currentSectionTemplates = sectionTemplates.slice(firstSectionTemplateIndex, lastSectionTemplateIndex);

  const totalPages = Math.ceil(sectionTemplates.length / sectionTemplatesPerPage);

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
            value={sectionTemplateData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Main Section:</label>
          <input
            type="text"
            name="mainSection"
            value={sectionTemplateData.mainSection}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Sub Section:</label>
          <input
            type="text"
            name="subSection"
            value={sectionTemplateData.subSection}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Machine Type:</label>
          <input
            type="text"
            name="machineType"
            value={sectionTemplateData.machineType}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Parameter:</label>
          <input
            type="text"
            name="parameter"
            value={sectionTemplateData.parameter}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tolerance ID:</label>
          <input
            type="text"
            name="toleranceId"
            value={sectionTemplateData.toleranceId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Threshold:</label>
          <input
            type="text"
            name="threshold"
            value={sectionTemplateData.threshold}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Has Deleted:</label>
          <input
            type="checkbox"
            name="hasDeleted"
            checked={sectionTemplateData.hasDeleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Creator ID:</label>
          <input
            type="text"
            name="creatorId"
            value={sectionTemplateData.creatorId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Modified ID:</label>
          <input
            type="text"
            name="modifiedId"
            value={sectionTemplateData.modifiedId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Created Time:</label>
          <input
            type="text"
            name="createdTime"
            value={sectionTemplateData.createdTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Modified Time:</label>
          <input
            type="text"
            name="modifiedTime"
            value={sectionTemplateData.modifiedTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Plant Department ID:</label>
          <input
            type="text"
            name="plantDepId"
            value={sectionTemplateData.plantDepId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Parameter Short Name:</label>
          <input
            type="text"
            name="parameterShortName"
            value={sectionTemplateData.parameterShortName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Sort Number:</label>
          <input
            type="text"
            name="sortNumber"
            value={sectionTemplateData.sortNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Is Dynamic:</label>
          <input
            type="checkbox"
            name="isDynamic"
            checked={sectionTemplateData.isDynamic}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Equation:</label>
          <input
            type="text"
            name="equation"
            value={sectionTemplateData.equation}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? "Update Section Template" : "Add Section Template"}</button>
      </form>

      {/* Table section */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Main Section</th>
            <th>Sub Section</th>
            <th>Machine Type</th>
            <th>Parameter</th>
            <th>Tolerance ID</th>
            <th>Threshold</th>
            <th>Has Deleted</th>
            <th>Creator ID</th>
            <th>Modified ID</th>
            <th>Created Time</th>
            <th>Modified Time</th>
            <th>Plant Department ID</th>
            <th>Parameter Short Name</th>
            <th>Sort Number</th>
            <th>Is Dynamic</th>
            <th>Equation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSectionTemplates.map((template, index) => (
            <tr key={index}>
              <td>{template.id}</td>
              <td>{template.mainSection}</td>
              <td>{template.subSection}</td>
              <td>{template.machineType}</td>
              <td>{template.parameter}</td>
              <td>{template.toleranceId}</td>
              <td>{template.threshold}</td>
              <td>{template.hasDeleted ? "Yes" : "No"}</td>
              <td>{template.creatorId}</td>
              <td>{template.modifiedId}</td>
              <td>{new Date(template.createdTime).toLocaleString()}</td>
              <td>{new Date(template.modifiedTime).toLocaleString()}</td>
              <td>{template.plantDepId}</td>
              <td>{template.parameterShortName}</td>
              <td>{template.sortNumber}</td>
              <td>{template.isDynamic ? "Yes" : "No"}</td>
              <td>{template.equation}</td>
              <td>
                <button onClick={() => handleEdit(firstSectionTemplateIndex + index)}>🖉 Edit</button>
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

export default SectionTemplateTable;
