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

const ParameterNormTable = () => {
  const [parameterNorms, setParameterNorms] = useState([]);
  const [newParameterNorm, setNewParameterNorm] = useState({
    id: "",
    parameter: "",
    plantDepld: "",
    minValue: "",
    maxValue: "",
    nDateTime: "",
    hasDeleted: false,
  });
  const [editingParameterNorm, setEditingParameterNorm] = useState(null); // To track the parameter norm being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        id: "1",
        parameter: "Temperature",
        plantDepld: "Plant A",
        minValue: "20",
        maxValue: "80",
        nDateTime: new Date().toISOString(),
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
      {
        id: "2",
        parameter: "Pressure",
        plantDepld: "Plant B",
        minValue: "5",
        maxValue: "100",
        nDateTime: new Date().toISOString(),
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
    ];
    setParameterNorms(initialData);
  }, []);

  const handleAddParameterNorm = () => {
    // Check if any required field is empty
    if (
      Object.entries(newParameterNorm).some(
        ([key, value]) => key !== "hasDeleted" && value.trim() === ""
      )
    ) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newParameterNormData = {
      ...newParameterNorm,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing parameter norm
    if (editingParameterNorm) {
      const updatedParameterNorms = parameterNorms.map((paramNorm) =>
        paramNorm === editingParameterNorm ? { ...newParameterNormData } : paramNorm
      );
      setParameterNorms(updatedParameterNorms);
      setEditingParameterNorm(null); // Stop editing after save
    } else {
      // Add a new parameter norm to the list
      setParameterNorms((prevParameterNorms) => [...prevParameterNorms, newParameterNormData]);
    }

    resetNewParameterNorm(); // Clear input fields after adding or saving
  };

  const handleEditParameterNorm = (paramNorm) => {
    setEditingParameterNorm(paramNorm);
    setNewParameterNorm({ ...paramNorm }); // Populate the form fields with the current parameter norm's data
  };

  const handleDeleteParameterNorm = (parameterNormIndex) => {
    setParameterNorms((prevParameterNorms) =>
      prevParameterNorms.filter((_, index) => index !== parameterNormIndex)
    );
  };

  const resetNewParameterNorm = () => {
    setNewParameterNorm({
      id: "",
      parameter: "",
      plantDepld: "",
      minValue: "",
      maxValue: "",
      nDateTime: "",
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

  return (
    <div className="table-main-content">
      <h2 className="page-title">Parameter Norm Table</h2>

      {/* Form for adding/editing parameter norms */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="ID"
            variant="outlined"
            value={newParameterNorm.id}
            onChange={(e) =>
              setNewParameterNorm({ ...newParameterNorm, id: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Parameter"
            variant="outlined"
            value={newParameterNorm.parameter}
            onChange={(e) =>
              setNewParameterNorm({ ...newParameterNorm, parameter: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Plant Depld"
            variant="outlined"
            value={newParameterNorm.plantDepld}
            onChange={(e) =>
              setNewParameterNorm({ ...newParameterNorm, plantDepld: e.target.value })
            }
            className="input-field"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newParameterNorm.hasDeleted}
                onChange={(e) =>
                  setNewParameterNorm({ ...newParameterNorm, hasDeleted: e.target.checked })
                }
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="Min Value"
            variant="outlined"
            value={newParameterNorm.minValue}
            onChange={(e) =>
              setNewParameterNorm({ ...newParameterNorm, minValue: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Max Value"
            variant="outlined"
            value={newParameterNorm.maxValue}
            onChange={(e) =>
              setNewParameterNorm({ ...newParameterNorm, maxValue: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="N Date Time"
            variant="outlined"
            value={newParameterNorm.nDateTime}
            onChange={(e) =>
              setNewParameterNorm({ ...newParameterNorm, nDateTime: e.target.value })
            }
            className="input-field"
          />
          
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Parameter Norm"
          onClick={handleAddParameterNorm}
        >
          {editingParameterNorm ? "Save Changes" : "Add Parameter Norm"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Parameter</StyledTableCell>
            <StyledTableCell>Plant Depld</StyledTableCell>
            <StyledTableCell>Min Value</StyledTableCell>
            <StyledTableCell>Max Value</StyledTableCell>
            <StyledTableCell>N Date Time</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parameterNorms
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((paramNorm, index) => (
              <TableRow key={index}>
                <TableCell>{paramNorm.id}</TableCell>
                <TableCell>{paramNorm.parameter}</TableCell>
                <TableCell>{paramNorm.plantDepld}</TableCell>
                <TableCell>{paramNorm.minValue}</TableCell>
                <TableCell>{paramNorm.maxValue}</TableCell>
                <TableCell>{new Date(paramNorm.nDateTime).toLocaleString()}</TableCell>
                <TableCell>{paramNorm.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{new Date(paramNorm.createdTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(paramNorm.modifiedTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteParameterNorm(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditParameterNorm(paramNorm)}
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
        count={parameterNorms.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ParameterNormTable;
