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

const MachineTable = () => {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState({
    machine: "",
    machineType: "",
    sapResource: "",
    hasDeleted: false,
    plantDepld: "",
  });
  const [editingMachine, setEditingMachine] = useState(null); // To track the machine being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        machine: "Machine 1",
        machineType: "Type A",
        sapResource: "SAP001",
        hasDeleted: false,
        plantDepld: "Plant 1",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
      {
        machine: "Machine 2",
        machineType: "Type B",
        sapResource: "SAP002",
        hasDeleted: false,
        plantDepld: "Plant 2",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
    ];
    setMachines(initialData);
  }, []);

  const handleAddMachine = () => {
    // Check if any required field is empty (except for hasDeleted, which is a boolean)
    if (
      Object.entries(newMachine).some(
        ([key, value]) =>
          (key !== "hasDeleted" && typeof value === "string" && value.trim() === "") ||
          (key === "hasDeleted" && value === null)
      )
    ) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newMachineData = {
      ...newMachine,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing machine
    if (editingMachine) {
      const updatedMachines = machines.map((machine) =>
        machine === editingMachine ? { ...newMachineData } : machine
      );
      setMachines(updatedMachines);
      setEditingMachine(null); // Stop editing after save
    } else {
      // Add a new machine to the list
      setMachines((prevMachines) => [...prevMachines, newMachineData]);
    }

    resetNewMachine(); // Clear input fields after adding or saving
  };

  const handleEditMachine = (machine) => {
    setEditingMachine(machine);
    setNewMachine({ ...machine }); // Populate the form fields with the current machine's data
  };

  const handleDeleteMachine = (machineIndex) => {
    setMachines((prevMachines) =>
      prevMachines.filter((_, index) => index !== machineIndex)
    );
  };

  const resetNewMachine = () => {
    setNewMachine({
      machine: "",
      machineType: "",
      sapResource: "",
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

  const handleCheckboxChange = (event) => {
    setNewMachine({ ...newMachine, hasDeleted: event.target.checked });
  };

  return (
    <div className="table-main-content">
      <h2 className="page-title">Machine Table</h2>

      {/* Form for adding/editing machines */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Machine"
            variant="outlined"
            value={newMachine.machine}
            onChange={(e) =>
              setNewMachine({ ...newMachine, machine: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Machine Type"
            variant="outlined"
            value={newMachine.machineType}
            onChange={(e) =>
              setNewMachine({ ...newMachine, machineType: e.target.value })
            }
            className="input-field"
          />
          {/* Has Deleted Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={newMachine.hasDeleted}
                onChange={handleCheckboxChange}
                name="hasDeleted"
                color="error"
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="SAP Resource"
            variant="outlined"
            value={newMachine.sapResource}
            onChange={(e) =>
              setNewMachine({ ...newMachine, sapResource: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Plant Depld"
            variant="outlined"
            value={newMachine.plantDepld}
            onChange={(e) =>
              setNewMachine({ ...newMachine, plantDepld: e.target.value })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Machine"
          onClick={handleAddMachine}
        >
          {editingMachine ? "Save Changes" : "Add Machine"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>Machine</StyledTableCell>
            <StyledTableCell>Machine Type</StyledTableCell>
            <StyledTableCell>SAP Resource</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Plant Depld</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((machine, index) => (
              <TableRow key={index}>
                <TableCell>{machine.machine}</TableCell>
                <TableCell>{machine.machineType}</TableCell>
                <TableCell>{machine.sapResource}</TableCell>
                <TableCell>{machine.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{new Date(machine.createdTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(machine.modifiedTime).toLocaleString()}</TableCell>
                <TableCell>{machine.plantDepld}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteMachine(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditMachine(machine)}
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
        count={machines.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default MachineTable;
