import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import "./Table.css";

// Create a styled TableCell for the header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.black, // Black text color
  fontWeight: "bold",
}));

const MachineTypeTable = () => {
  const [machineTypes, setMachineTypes] = useState([]);
  const [newMachineType, setNewMachineType] = useState({
    machineType: "",
    hasDeleted: false,
    plantDepld: "",
  });
  const [editingMachineType, setEditingMachineType] = useState(null); // To track the machine type being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        machineType: "KNT",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plantDepld: "Plant A",
      },
      {
        machineType: "PMP",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plantDepld: "Plant B",
      },
    ];
    setMachineTypes(initialData);
  }, []);

  const handleAddMachineType = () => {
    // Check if any required field is empty
    if (
      Object.entries(newMachineType).some(
        ([key, value]) => key !== "hasDeleted" && value.trim() === ""
      )
    ) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newMachineTypeData = {
      ...newMachineType,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing machine type
    if (editingMachineType) {
      const updatedMachineTypes = machineTypes.map((machineType) =>
        machineType === editingMachineType ? { ...newMachineTypeData } : machineType
      );
      setMachineTypes(updatedMachineTypes);
      setEditingMachineType(null); // Stop editing after save
    } else {
      // Add a new machine type to the list
      setMachineTypes((prevMachineTypes) => [...prevMachineTypes, newMachineTypeData]);
    }

    resetNewMachineType(); // Clear input fields after adding or saving
  };

  const handleEditMachineType = (machineType) => {
    setEditingMachineType(machineType);
    setNewMachineType({ ...machineType }); // Populate the form fields with the current machine type's data
  };

  const handleDeleteMachineType = (machineIndex) => {
    setMachineTypes((prevMachineTypes) =>
      prevMachineTypes.filter((_, index) => index !== machineIndex)
    );
  };

  const resetNewMachineType = () => {
    setNewMachineType({
      machineType: "",
      hasDeleted: false,
      plantDepld: "",
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
      <h2 className="page-title">Machine Type Table</h2>

      {/* Form for adding/editing machine types */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Machine Type"
            variant="outlined"
            value={newMachineType.machineType}
            onChange={(e) =>
              setNewMachineType({ ...newMachineType, machineType: e.target.value })
            }
            className="input-field"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newMachineType.hasDeleted}
                onChange={(e) =>
                  setNewMachineType({ ...newMachineType, hasDeleted: e.target.checked })
                }
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="Plant Depld"
            variant="outlined"
            value={newMachineType.plantDepld}
            onChange={(e) =>
              setNewMachineType({ ...newMachineType, plantDepld: e.target.value })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Machine Type"
          onClick={handleAddMachineType}
        >
          {editingMachineType ? "Save Changes" : "Add Machine Type"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>Machine Type</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Plant Depld</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machineTypes
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((machineType, index) => (
              <TableRow key={index}>
                <TableCell>{machineType.machineType}</TableCell>
                <TableCell>{machineType.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{new Date(machineType.createdTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(machineType.modifiedTime).toLocaleString()}</TableCell>
                <TableCell>{machineType.plantDepld}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteMachineType(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditMachineType(machineType)}
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
        count={machineTypes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default MachineTypeTable;
