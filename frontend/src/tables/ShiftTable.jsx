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

const ShiftTable = () => {
  const [shifts, setShifts] = useState([]);
  const [newShift, setNewShift] = useState({
    shift: "",
    plantDepartmentId: "",
    hasDeleted: false,
  });
  const [editingShift, setEditingShift] = useState(null); // To track the shift being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        shift: "Morning",
        plantDepartmentId: "PD01",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
    ];
    setShifts(initialData);
  }, []);

  const handleAddShift = () => {
    // Check if any required field is empty
    if (newShift.shift.trim() === "" || newShift.plantDepartmentId.trim() === "") {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newShiftData = {
      ...newShift,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing shift
    if (editingShift) {
      const updatedShifts = shifts.map((shift) =>
        shift === editingShift ? { ...newShiftData } : shift
      );
      setShifts(updatedShifts);
      setEditingShift(null); // Stop editing after save
    } else {
      // Add a new shift to the list
      setShifts((prevShifts) => [...prevShifts, newShiftData]);
    }

    resetNewShift(); // Clear input fields after adding or saving
  };

  const handleEditShift = (shift) => {
    setEditingShift(shift);
    setNewShift({ ...shift }); // Populate the form fields with the current shift's data
  };

  const handleDeleteShift = (shiftIndex) => {
    setShifts((prevShifts) =>
      prevShifts.filter((_, index) => index !== shiftIndex)
    );
  };

  const resetNewShift = () => {
    setNewShift({
      shift: "",
      plantDepartmentId: "",
      hasDeleted: false,
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
    setNewShift({ ...newShift, hasDeleted: event.target.checked });
  };

  return (
    <div className="table-main-content">
      <h2 className="page-title">Shift Table</h2>

      {/* Form for adding/editing shifts */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Shift"
            variant="outlined"
            value={newShift.shift}
            onChange={(e) =>
              setNewShift({ ...newShift, shift: e.target.value })
            }
            className="input-field"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newShift.hasDeleted}
                onChange={handleHasDeletedChange}
                color="error"
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="Plant Department ID"
            variant="outlined"
            value={newShift.plantDepartmentId}
            onChange={(e) =>
              setNewShift({ ...newShift, plantDepartmentId: e.target.value })
            }
            className="input-field"
          />
        </div>

        <Button
          variant="contained"
          color="error" // Red button for "Add Shift"
          onClick={handleAddShift}
        >
          {editingShift ? "Save Changes" : "Add Shift"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>Shift</StyledTableCell>
            <StyledTableCell>Plant Department ID</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shifts
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((shift, index) => (
              <TableRow key={index}>
                <TableCell>{shift.shift}</TableCell>
                <TableCell>{shift.plantDepartmentId}</TableCell>
                <TableCell>{shift.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{shift.createdTime}</TableCell>
                <TableCell>{shift.modifiedTime}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteShift(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditShift(shift)}
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
        count={shifts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ShiftTable;
