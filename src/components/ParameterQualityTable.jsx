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
import "./Table.css"; // Import the CSS file for custom styles

const ParameterQualityTable = () => {
  const [parameters, setParameters] = useState([]); // State to store parameter quality data
  const [newParameter, setNewParameter] = useState({
    id: "",
    plannedEpld: "",
    materialCode: "",
    parameter: "",
    minValue: "",
    target: "",
    maxValue: ""
  }); // State for new parameter input
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch initial parameter quality data (mocked for demonstration)
  useEffect(() => {
    const initialData = [
      {
        id: '1',
        plannedEpld: '2024-12-31',
        materialCode: 'MTR001',
        parameter: 'Parameter A',
        minValue: 10,
        target: 20,
        maxValue: 30
      },
      {
        id: '2',
        plannedEpld: '2024-11-30',
        materialCode: 'MTR002',
        parameter: 'Parameter B',
        minValue: 5,
        target: 15,
        maxValue: 25
      },
    ];
    setParameters(initialData);
  }, []);

  // Handle adding a new parameter quality entry
  const handleAddParameter = () => {
    const newParameterData = {
      ...newParameter
    };
    setParameters([...parameters, newParameterData]);
    setNewParameter({
      id: "",
      plannedEpld: "",
      materialCode: "",
      parameter: "",
      minValue: "",
      target: "",
      maxValue: ""
    });
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {/* Form for adding new parameter quality entries */}
      <div className="form-container">
        <TextField
          label="ID"
          variant="outlined"
          value={newParameter.id}
          onChange={(e) => setNewParameter({ ...newParameter, id: e.target.value })}
          className="form-input"
        />
        <TextField
          label="Planned Epld"
          variant="outlined"
          value={newParameter.plannedEpld}
          onChange={(e) => setNewParameter({ ...newParameter, plannedEpld: e.target.value })}
          className="form-input"
        />
        <TextField
          label="Material Code"
          variant="outlined"
          value={newParameter.materialCode}
          onChange={(e) => setNewParameter({ ...newParameter, materialCode: e.target.value })}
          className="form-input"
        />
        <TextField
          label="Parameter"
          variant="outlined"
          value={newParameter.parameter}
          onChange={(e) => setNewParameter({ ...newParameter, parameter: e.target.value })}
          className="form-input"
        />
        <TextField
          label="Min Value"
          variant="outlined"
          type="number"
          value={newParameter.minValue}
          onChange={(e) => setNewParameter({ ...newParameter, minValue: e.target.value })}
          className="form-input"
        />
        <TextField
          label="Target"
          variant="outlined"
          type="number"
          value={newParameter.target}
          onChange={(e) => setNewParameter({ ...newParameter, target: e.target.value })}
          className="form-input"
        />
        <TextField
          label="Max Value"
          variant="outlined"
          type="number"
          value={newParameter.maxValue}
          onChange={(e) => setNewParameter({ ...newParameter, maxValue: e.target.value })}
          className="form-input"
        />
        <Button variant="contained" className="add-button" onClick={handleAddParameter}>
          Add Parameter Quality
        </Button>
      </div>

      {/* Parameter Quality Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Planned Epld</TableCell>
              <TableCell>Material Code</TableCell>
              <TableCell>Parameter</TableCell>
              <TableCell>Min Value</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Max Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((param, index) => (
              <TableRow key={index}>
                <TableCell>{param.id}</TableCell>
                <TableCell>{param.plannedEpld}</TableCell>
                <TableCell>{param.materialCode}</TableCell>
                <TableCell>{param.parameter}</TableCell>
                <TableCell>{param.minValue}</TableCell>
                <TableCell>{param.target}</TableCell>
                <TableCell>{param.maxValue}</TableCell>
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

export default ParameterQualityTable;
