import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import './Table.css';

const ParameterTable = () => {
  const [parameters, setParameters] = useState([]);
  const [newParameter, setNewParameter] = useState({
    parameter: "",
    hasDeleted: false,
    plannedEpld: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // Fetch initial parameter data
    const initialData = [
      {
        id: 1,
        parameter: "Param A",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: "2024-12-31",
      },
      {
        id: 2,
        parameter: "Param B",
        hasDeleted: true,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: "2024-11-30",
      },
    ];
    setParameters(initialData);
  }, []);

  const handleAddParameter = () => {
    if (!newParameter.parameter || !newParameter.plannedEpld) {
      setSnackbarMessage("Please fill all required fields.");
      setOpenSnackbar(true);
      return;
    }

    const newParameterData = {
      ...newParameter,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      id: parameters.length + 1, // or use a more robust id generator
    };

    setParameters([...parameters, newParameterData]);
    setNewParameter({ parameter: "", hasDeleted: false, plannedEpld: "" });
    setSnackbarMessage("Parameter added successfully!");
    setOpenSnackbar(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setParameters((prevParameters) => prevParameters.map(param => ({
        ...param,
        modifiedTime: new Date().toISOString()
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="machine-table">
      <div className="form-container mb-4">
        <TextField
          label="Parameter"
          variant="outlined"
          value={newParameter.parameter}
          onChange={(e) => setNewParameter({ ...newParameter, parameter: e.target.value })}
          className="form-input mr-2"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={newParameter.hasDeleted}
              onChange={(e) => setNewParameter({ ...newParameter, hasDeleted: e.target.checked })}
            />
          }
          label="Has Deleted"
        />
        <TextField
          label="Planned Epld"
          variant="outlined"
          value={newParameter.plannedEpld}
          onChange={(e) => setNewParameter({ ...newParameter, plannedEpld: e.target.value })}
          className="form-input mr-2"
        />
        <Button variant="contained" className="add-button" onClick={handleAddParameter}>
          Add Parameter
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell>Has Deleted</TableCell>
              <TableCell>Created Time</TableCell>
              <TableCell>Modified Time</TableCell>
              <TableCell>Planned Epld</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((param) => (
              <TableRow key={param.id}>
                <TableCell>{param.parameter}</TableCell>
                <TableCell>{param.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{param.createdTime}</TableCell>
                <TableCell>{param.modifiedTime}</TableCell>
                <TableCell>{param.plannedEpld}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={parameters.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ParameterTable;
