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

const SectionTable = () => {
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({
    mainSection: "",
    subSection: "",
    machineType: "",
    parameterToleranced: "",
    threshold: "",
    hasDeleted: false,
    creatorId: "",
    modifierId: "",
    createdTime: "",
    modifiedTime: "",
    plannedEpld: "",
    parameterShortName: "",
    sortNumber: "",
    isDynamic: false,
    equation: "",
  });
  const [editingSection, setEditingSection] = useState(null); // To track the section being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        mainSection: "Section A",
        subSection: "Sub A1",
        machineType: "Machine Type 1",
        parameterToleranced: "Yes",
        threshold: "High",
        hasDeleted: false,
        creatorId: "Creator01",
        modifierId: "Modifier01",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: "24",
        parameterShortName: "Param A1",
        sortNumber: "1",
        isDynamic: true,
        equation: "x + y = z",
      },
    ];
    setSections(initialData);
  }, []);

  const handleAddSection = () => {
    // Check if any required field is empty
    if (Object.entries(newSection).some(([key, value]) => value.trim() === "")) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newSectionData = {
      ...newSection,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing section
    if (editingSection) {
      const updatedSections = sections.map((section) =>
        section === editingSection ? { ...newSectionData } : section
      );
      setSections(updatedSections);
      setEditingSection(null); // Stop editing after save
    } else {
      // Add a new section to the list
      setSections((prevSections) => [...prevSections, newSectionData]);
    }

    resetNewSection(); // Clear input fields after adding or saving
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setNewSection({ ...section }); // Populate the form fields with the current section's data
  };

  const handleDeleteSection = (sectionIndex) => {
    setSections((prevSections) =>
      prevSections.filter((_, index) => index !== sectionIndex)
    );
  };

  const resetNewSection = () => {
    setNewSection({
      mainSection: "",
      subSection: "",
      machineType: "",
      parameterToleranced: "",
      threshold: "",
      hasDeleted: false,
      creatorId: "",
      modifierId: "",
      createdTime: "",
      modifiedTime: "",
      plannedEpld: "",
      parameterShortName: "",
      sortNumber: "",
      isDynamic: false,
      equation: "",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="table-main-content">
      <h2 className="page-title">Section Table</h2>

      {/* Form for adding/editing sections */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Main Section"
            variant="outlined"
            value={newSection.mainSection}
            onChange={(e) =>
              setNewSection({ ...newSection, mainSection: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Sub Section"
            variant="outlined"
            value={newSection.subSection}
            onChange={(e) =>
              setNewSection({ ...newSection, subSection: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Machine Type"
            variant="outlined"
            value={newSection.machineType}
            onChange={(e) =>
              setNewSection({ ...newSection, machineType: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Parameter Toleranced"
            variant="outlined"
            value={newSection.parameterToleranced}
            onChange={(e) =>
              setNewSection({ ...newSection, parameterToleranced: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Threshold"
            variant="outlined"
            value={newSection.threshold}
            onChange={(e) =>
              setNewSection({ ...newSection, threshold: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Creator ID"
            variant="outlined"
            value={newSection.creatorId}
            onChange={(e) =>
              setNewSection({ ...newSection, creatorId: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Modifier ID"
            variant="outlined"
            value={newSection.modifierId}
            onChange={(e) =>
              setNewSection({ ...newSection, modifierId: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Planned Epld"
            variant="outlined"
            value={newSection.plannedEpld}
            onChange={(e) =>
              setNewSection({ ...newSection, plannedEpld: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Parameter Short Name"
            variant="outlined"
            value={newSection.parameterShortName}
            onChange={(e) =>
              setNewSection({ ...newSection, parameterShortName: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Sort Number"
            variant="outlined"
            value={newSection.sortNumber}
            onChange={(e) =>
              setNewSection({ ...newSection, sortNumber: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Equation"
            variant="outlined"
            value={newSection.equation}
            onChange={(e) =>
              setNewSection({ ...newSection, equation: e.target.value })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Section"
          onClick={handleAddSection}
        >
          {editingSection ? "Save Changes" : "Add Section"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Main Section</StyledTableCell>
            <StyledTableCell>Sub Section</StyledTableCell>
            <StyledTableCell>Machine Type</StyledTableCell>
            <StyledTableCell>Parameter Toleranced</StyledTableCell>
            <StyledTableCell>Threshold</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Creator ID</StyledTableCell>
            <StyledTableCell>Modifier ID</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Planned Epld</StyledTableCell>
            <StyledTableCell>Parameter Short Name</StyledTableCell>
            <StyledTableCell>Sort Number</StyledTableCell>
            <StyledTableCell>Is Dynamic</StyledTableCell>
            <StyledTableCell>Equation</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sections
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((section, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{section.mainSection}</TableCell>
                <TableCell>{section.subSection}</TableCell>
                <TableCell>{section.machineType}</TableCell>
                <TableCell>{section.parameterToleranced}</TableCell>
                <TableCell>{section.threshold}</TableCell>
                <TableCell>{section.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{section.creatorId}</TableCell>
                <TableCell>{section.modifierId}</TableCell>
                <TableCell>{section.createdTime}</TableCell>
                <TableCell>{section.modifiedTime}</TableCell>
                <TableCell>{section.plannedEpld}</TableCell>
                <TableCell>{section.parameterShortName}</TableCell>
                <TableCell>{section.sortNumber}</TableCell>
                <TableCell>{section.isDynamic ? "Yes" : "No"}</TableCell>
                <TableCell>{section.equation}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteSection(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditSection(section)}
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
        count={sections.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default SectionTable;
