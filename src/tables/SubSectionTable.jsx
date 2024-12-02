import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import "./Table.css";

// Create a styled TableCell for the header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.black, // Black text color
  fontWeight: "bold",
}));

const SubSectionTable = () => {
  const [subSections, setSubSections] = useState([]);
  const [newSubSection, setNewSubSection] = useState({
    subSection: "",
    hasDeleted: false,
    plantDepartmentId: "",
    createdTime: "",
    modifiedTime: "",
  });
  const [editingSubSection, setEditingSubSection] = useState(null); // To track the sub-section being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        subSection: "Packaging",
        hasDeleted: false,
        plantDepartmentId: "PD01",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
    ];
    setSubSections(initialData);
  }, []);

  const handleAddSubSection = () => {
    // Check if any required field is empty
    if (!newSubSection.subSection.trim() || !newSubSection.plantDepartmentId.trim()) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newSubSectionData = {
      ...newSubSection,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing sub-section
    if (editingSubSection) {
      const updatedSubSections = subSections.map((subSection) =>
        subSection === editingSubSection ? { ...newSubSectionData } : subSection
      );
      setSubSections(updatedSubSections);
      setEditingSubSection(null); // Stop editing after save
    } else {
      // Add a new sub-section to the list
      setSubSections((prevSubSections) => [...prevSubSections, newSubSectionData]);
    }

    resetNewSubSection(); // Clear input fields after adding or saving
  };

  const handleEditSubSection = (subSection) => {
    setEditingSubSection(subSection);
    setNewSubSection({ ...subSection }); // Populate the form fields with the current sub-section's data
  };

  const handleDeleteSubSection = (subSectionIndex) => {
    setSubSections((prevSubSections) =>
      prevSubSections.filter((_, index) => index !== subSectionIndex)
    );
  };

  const resetNewSubSection = () => {
    setNewSubSection({
      subSection: "",
      hasDeleted: false,
      plantDepartmentId: "",
      createdTime: "",
      modifiedTime: "",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleHasDeletedChange = (event) => {
    setNewSubSection({ ...newSubSection, hasDeleted: event.target.checked });
  };

  return (
    <div className="table-main-content">
      <h2 className="page-title">Sub Section Table</h2>

      {/* Form for adding/editing sub-sections */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Sub Section"
            variant="outlined"
            value={newSubSection.subSection}
            onChange={(e) =>
              setNewSubSection({ ...newSubSection, subSection: e.target.value })
            }
            className="input-field"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newSubSection.hasDeleted}
                onChange={handleHasDeletedChange}
                color="error"
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="Plant Department ID"
            variant="outlined"
            value={newSubSection.plantDepartmentId}
            onChange={(e) =>
              setNewSubSection({ ...newSubSection, plantDepartmentId: e.target.value })
            }
            className="input-field"
          />
        </div>

        <Button
          variant="contained"
          color="error" // Red button for "Add Sub Section"
          onClick={handleAddSubSection}
        >
          {editingSubSection ? "Save Changes" : "Add Sub Section"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>Sub Section</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Plant Department ID</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subSections
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subSection, index) => (
              <TableRow key={index}>
                <TableCell>{subSection.subSection}</TableCell>
                <TableCell>{subSection.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{subSection.createdTime}</TableCell>
                <TableCell>{subSection.modifiedTime}</TableCell>
                <TableCell>{subSection.plantDepartmentId}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteSubSection(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditSubSection(subSection)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

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
