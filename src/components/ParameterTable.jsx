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
  Button
} from "@mui/material";
import './ParameterTable.css'; 


const ParameterTable = () => {
  const [parameters, setParameters] = useState([]); // State to store parameter data
  const [newParameter, setNewParameter] = useState({
    parameter: "",
    hasDeleted: false,
    createdTime: "",
    modifiedTime: "",
    plannedEpld: ""
  }); // State for new parameter input
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch initial parameter data (mocked for demonstration)
  useEffect(() => {
    const initialData = [
      {
        parameter: "Param A",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: "2024-12-31"
      },
      {
        parameter: "Param B",
        hasDeleted: true,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: "2024-11-30"
      }
    ];
    setParameters(initialData);
  }, []);

  // Handle adding a new parameter
  const handleAddParameter = () => {
    const newParameterData = {
      ...newParameter,
      createdTime: new Date().toISOString(), // Set created time
      modifiedTime: new Date().toISOString() // Set modified time
    };
    setParameters([...parameters, newParameterData]);
    setNewParameter({
      parameter: "",
      hasDeleted: false,
      createdTime: "",
      modifiedTime: "",
      plannedEpld: ""
    });
  };

  // Auto-update data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setParameters(prevParameters => {
        return prevParameters.map(param => ({
          ...param,
          modifiedTime: new Date().toISOString() // Update modified time to current time
        }));
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="machine-table">
      {/* Form for adding new parameters */}
      <div className="form-container mb-4">
        <TextField
          label="Parameter"
          variant="outlined"
          value={newParameter.parameter}
          onChange={e => setNewParameter({ ...newParameter, parameter: e.target.value })}
          className="form-input mr-2"
        />
        <TextField
          label="Has Deleted"
          type="checkbox"
          checked={newParameter.hasDeleted}
          onChange={e => setNewParameter({ ...newParameter, hasDeleted: e.target.checked })}
          className="form-checkbox mr-2"
        />
        <TextField
          label="Planned Epld"
          variant="outlined"
          value={newParameter.plannedEpld}
          onChange={e => setNewParameter({ ...newParameter, plannedEpld: e.target.value })}
          className="form-input mr-2"
        />
        <Button variant="contained" className="add-button" onClick={handleAddParameter}>
          Add Parameter
        </Button>
      </div>

      {/* Parameter Table */}
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
            {parameters
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((param, index) => (
                <TableRow key={index}>
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

      {/* Pagination */}
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
