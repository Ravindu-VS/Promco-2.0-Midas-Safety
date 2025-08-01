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

const ToleranceTable = () => {
  const [tolerances, setTolerances] = useState([]);
  const [newTolerance, setNewTolerance] = useState({
    name: "",
    type: "",
    hasDeleted: false,
    creatorId: "",
    modifiedId: "",
    plantDepartmentId: "",
    createdTime: "",
    modifiedTime: "",
  });
  const [editingTolerance, setEditingTolerance] = useState(null); // To track the tolerance being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        name: "Tolerance 1",
        type: "Type A",
        hasDeleted: false,
        creatorId: "User01",
        modifiedId: "User02",
        plantDepartmentId: "PD01",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
    ];
    setTolerances(initialData);
  }, []);

  const handleAddTolerance = () => {
    // Check if any required field is empty
    const requiredFields = [
      "name",
      "type",
      "creatorId",
      "modifiedId",
      "plantDepartmentId",
    ];
    if (requiredFields.some((field) => newTolerance[field].trim() === "")) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newToleranceData = {
      ...newTolerance,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing tolerance
    if (editingTolerance) {
      const updatedTolerances = tolerances.map((tolerance) =>
        tolerance === editingTolerance ? { ...newToleranceData } : tolerance
      );
      setTolerances(updatedTolerances);
      setEditingTolerance(null); // Stop editing after save
    } else {
      // Add a new tolerance to the list
      setTolerances((prevTolerances) => [...prevTolerances, newToleranceData]);
    }

    resetNewTolerance(); // Clear input fields after adding or saving
  };

  const handleEditTolerance = (tolerance) => {
    setEditingTolerance(tolerance);
    setNewTolerance({ ...tolerance }); // Populate the form fields with the current tolerance's data
  };

  const handleDeleteTolerance = (toleranceIndex) => {
    setTolerances((prevTolerances) =>
      prevTolerances.filter((_, index) => index !== toleranceIndex)
    );
  };

  const resetNewTolerance = () => {
    setNewTolerance({
      name: "",
      type: "",
      hasDeleted: false,
      creatorId: "",
      modifiedId: "",
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
    setNewTolerance({ ...newTolerance, hasDeleted: event.target.checked });
  };

  // Utility function for date formatting
  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="table-main-content">
      <h2 className="page-title">Tolerance Table</h2>

      {/* Form for adding/editing tolerances */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Name"
            variant="outlined"
            value={newTolerance.name}
            onChange={(e) =>
              setNewTolerance({ ...newTolerance, name: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Type"
            variant="outlined"
            value={newTolerance.type}
            onChange={(e) =>
              setNewTolerance({ ...newTolerance, type: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Creator ID"
            variant="outlined"
            value={newTolerance.creatorId}
            onChange={(e) =>
              setNewTolerance({ ...newTolerance, creatorId: e.target.value })
            }
            className="input-field"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newTolerance.hasDeleted}
                onChange={handleHasDeletedChange}
                color="error"
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="Modified ID"
            variant="outlined"
            value={newTolerance.modifiedId}
            onChange={(e) =>
              setNewTolerance({ ...newTolerance, modifiedId: e.target.value })
            }
            className="input-field"
          />
          
          <TextField
            label="Plant Department ID"
            variant="outlined"
            value={newTolerance.plantDepartmentId}
            onChange={(e) =>
              setNewTolerance({ ...newTolerance, plantDepartmentId: e.target.value })
            }
            className="input-field"
          />
        </div>

        <Button
          variant="contained"
          color="error" // Red button for "Add Tolerance"
          onClick={handleAddTolerance}
        >
          {editingTolerance ? "Save Changes" : "Add Tolerance"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Creator ID</StyledTableCell>
            <StyledTableCell>Modified ID</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Plant Department ID</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tolerances
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((tolerance, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{tolerance.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{tolerance.name}</TableCell>
                <TableCell>{tolerance.type}</TableCell>
                <TableCell>{tolerance.creatorId}</TableCell>
                <TableCell>{tolerance.modifiedId}</TableCell>
                <TableCell>{formatDate(tolerance.createdTime)}</TableCell>
                <TableCell>{formatDate(tolerance.modifiedTime)}</TableCell>
                <TableCell>{tolerance.plantDepartmentId}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteTolerance(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditTolerance(tolerance)}
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
        count={tolerances.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ToleranceTable;
