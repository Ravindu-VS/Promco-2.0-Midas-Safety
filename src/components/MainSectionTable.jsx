import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, Button } from "@mui/material";
import './MainSectionTable.css'; // Import the CSS file

const MainSectionTable = () => {
  const [sections, setSections] = useState([]); // State to store section data
  const [newSection, setNewSection] = useState({
    mainSection: "",
    mainSectionName: "",
    hasDeleted: false,
    createdTime: "",
    modifiedTime: "",
    plannedEpld: ""
  }); // State for new section input
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch initial section data (mocked for demonstration)
  useEffect(() => {
    const initialData = [
      {
        mainSection: 'Section A',
        mainSectionName: 'Main A',
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: '2024-12-31'
      },
      {
        mainSection: 'Section B',
        mainSectionName: 'Main B',
        hasDeleted: true,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: '2024-11-30'
      },
    ];
    setSections(initialData);
  }, []);

  // Handle adding a new section
  const handleAddSection = () => {
    const newSectionData = {
      ...newSection,
      createdTime: new Date().toISOString(), // Set created time
      modifiedTime: new Date().toISOString() // Set modified time
    };
    setSections([...sections, newSectionData]);
    setNewSection({
      mainSection: "",
      mainSectionName: "",
      hasDeleted: false,
      createdTime: "",
      modifiedTime: "",
      plannedEpld: ""
    });
  };

  // Auto-update data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSections(prevSections => {
        return prevSections.map(section => ({
          ...section,
          modifiedTime: new Date().toISOString() // Update modified time to current time
        }));
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="machine-table">
      {/* Form for adding new sections */}
      <div className="form-container">
        <TextField
          className="form-input"
          label="Main Section"
          variant="outlined"
          value={newSection.mainSection}
          onChange={(e) => setNewSection({ ...newSection, mainSection: e.target.value })}
        />
        <TextField
          className="form-input"
          label="Main Section Name"
          variant="outlined"
          value={newSection.mainSectionName}
          onChange={(e) => setNewSection({ ...newSection, mainSectionName: e.target.value })}
        />
        <TextField
          className="form-checkbox"
          label="Has Deleted"
          type="checkbox"
          checked={newSection.hasDeleted}
          onChange={(e) => setNewSection({ ...newSection, hasDeleted: e.target.checked })}
        />
        <TextField
          className="form-input"
          label="Planned Epld"
          variant="outlined"
          value={newSection.plannedEpld}
          onChange={(e) => setNewSection({ ...newSection, plannedEpld: e.target.value })}
        />
        <Button variant="contained" color="primary" onClick={handleAddSection}>
          Add Section
        </Button>
      </div>

      {/* Main Section Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Main Section</TableCell>
              <TableCell>Main Section Name</TableCell>
              <TableCell>Has Deleted</TableCell>
              <TableCell>Created Time</TableCell>
              <TableCell>Modified Time</TableCell>
              <TableCell>Planned Epld</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((section, index) => (
              <TableRow key={index} className={section.hasDeleted ? 'deleted-row' : ''}>
                <TableCell>{section.mainSection}</TableCell>
                <TableCell>{section.mainSectionName}</TableCell>
                <TableCell>{section.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{section.createdTime}</TableCell>
                <TableCell>{section.modifiedTime}</TableCell>
                <TableCell>{section.plannedEpld}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sections.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default MainSectionTable;
