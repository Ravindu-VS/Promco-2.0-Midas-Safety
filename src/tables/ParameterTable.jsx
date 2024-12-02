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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import "./Table.css";

// Create a styled TableCell for the header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.black, // Black text color
  fontWeight: "bold",
}));

const ParameterTable = () => {
  const [parameters, setParameters] = useState([]);
  const [newParameter, setNewParameter] = useState({
    parameter: "",
    hasDeleted: false,
    plantDepld: "",
  });
  const [editingParameter, setEditingParameter] = useState(null); // To track the parameter being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        parameter: "Temperature",
        hasDeleted: false,
        plantDepld: "Plant A",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
      {
        parameter: "Pressure",
        hasDeleted: false,
        plantDepld: "Plant B",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
    ];
    setParameters(initialData);
  }, []);

  const handleAddParameter = () => {
    // Check if any required field is empty
    if (
      Object.entries(newParameter).some(
        ([key, value]) =>
          typeof value === "string" && value.trim() === "" && key !== "hasDeleted"
      )
    ) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newParameterData = {
      ...newParameter,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing parameter
    if (editingParameter) {
      const updatedParameters = parameters.map((param) =>
        param === editingParameter ? { ...newParameterData } : param
      );
      setParameters(updatedParameters);
      setEditingParameter(null); // Stop editing after save
    } else {
      // Add a new parameter to the list
      setParameters((prevParameters) => [
        ...prevParameters,
        newParameterData,
      ]);
    }

    resetNewParameter(); // Clear input fields after adding or saving
  };

  const handleEditParameter = (parameter) => {
    setEditingParameter(parameter);
    setNewParameter({ ...parameter }); // Populate the form fields with the current parameter's data
  };

  const handleDeleteParameter = (parameterIndex) => {
    setParameters((prevParameters) =>
      prevParameters.filter((_, index) => index !== parameterIndex)
    );
  };

  const resetNewParameter = () => {
    setNewParameter({
      parameter: "",
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
      <h2 className="page-title">Parameter Table</h2>

      {/* Form for adding/editing parameters */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Parameter"
            variant="outlined"
            value={newParameter.parameter}
            onChange={(e) =>
              setNewParameter({ ...newParameter, parameter: e.target.value })
            }
            className="input-field"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newParameter.hasDeleted}
                onChange={(e) =>
                  setNewParameter({ ...newParameter, hasDeleted: e.target.checked })
                }
                color="error"
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="Plant Depld"
            variant="outlined"
            value={newParameter.plantDepld}
            onChange={(e) =>
              setNewParameter({ ...newParameter, plantDepld: e.target.value })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Parameter"
          onClick={handleAddParameter}
        >
          {editingParameter ? "Save Changes" : "Add Parameter"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>Parameter</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Plant Depld</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parameters
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((parameter, index) => (
              <TableRow key={index}>
                <TableCell>{parameter.parameter}</TableCell>
                <TableCell>{parameter.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{new Date(parameter.createdTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(parameter.modifiedTime).toLocaleString()}</TableCell>
                <TableCell>{parameter.plantDepld}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteParameter(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditParameter(parameter)}
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
        count={parameters.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ParameterTable;
