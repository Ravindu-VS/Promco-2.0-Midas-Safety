import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, Button } from "@mui/material";

const SubSectionTable = () => {
  const [subSections, setSubSections] = useState([]); // State to store subsection data
  const [newSubSection, setNewSubSection] = useState({
    subSection: "",
    hasDeleted: false,
    createdTime: "",
    modifiedTime: "",
    plannedEpld: ""
  }); // State for new subsection input
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch initial subsection data (mocked for demonstration)
  useEffect(() => {
    const initialData = [
      {
        subSection: 'Subsection A',
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: '2024-12-31'
      },
      {
        subSection: 'Subsection B',
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: '2024-11-30'
      },
    ];
    setSubSections(initialData);
  }, []);

  // Handle adding a new subsection
  const handleAddSubSection = () => {
    const newSubSectionData = {
      ...newSubSection,
      createdTime: new Date().toISOString(), // Set created time
      modifiedTime: new Date().toISOString() // Set modified time
    };
    setSubSections([...subSections, newSubSectionData]);
    setNewSubSection({
      subSection: "",
      hasDeleted: false,
      createdTime: "",
      modifiedTime: "",
      plannedEpld: ""
    });
  };

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
    <div>
      {/* Form for adding new subsections */}
      <div className="mb-4">
        <TextField
          label="Subsection"
          variant="outlined"
          value={newSubSection.subSection}
          onChange={(e) => setNewSubSection({ ...newSubSection, subSection: e.target.value })}
          className="mr-2"
        />
        <TextField
          label="Has Deleted"
          type="checkbox"
          checked={newSubSection.hasDeleted}
          onChange={(e) => setNewSubSection({ ...newSubSection, hasDeleted: e.target.checked })}
          className="mr-2"
        />
        <TextField
          label="Planned Epld"
          variant="outlined"
          value={newSubSection.plannedEpld}
          onChange={(e) => setNewSubSection({ ...newSubSection, plannedEpld: e.target.value })}
          className="mr-2"
        />
        <Button variant="contained" color="primary" onClick={handleAddSubSection}>
          Add Subsection
        </Button>
      </div>

      {/* Subsection Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subsection</TableCell>
              <TableCell>Has Deleted</TableCell>
              <TableCell>Created Time</TableCell>
              <TableCell>Modified Time</TableCell>
              <TableCell>Planned Epld</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subSections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subSection, index) => (
              <TableRow key={index}>
                <TableCell>{subSection.subSection}</TableCell>
                <TableCell>{subSection.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{subSection.createdTime}</TableCell>
                <TableCell>{subSection.modifiedTime}</TableCell>
                <TableCell>{subSection.plannedEpld}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={subSections.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default SubSectionTable;
