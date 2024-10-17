import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, Button } from "@mui/material";
import './Table.css';

const ToleranceTable = () => {
  const [tolerances, setTolerances] = useState([]); // State to store tolerance data
  const [newTolerance, setNewTolerance] = useState({
    id: "",
    hasDeleted: false,
    name: "",
    type: "",
    creatorId: "",
    modifierId: "",
    plannedEpld: ""
  }); // State for new tolerance input
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch initial tolerance data (mocked for demonstration)
  useEffect(() => {
    const initialData = [
      {
        id: '1',
        hasDeleted: false,
        name: 'Tolerance A',
        type: 'Type 1',
        creatorId: 'User1',
        modifierId: 'User2',
        plannedEpld: '2024-12-31'
      },
      {
        id: '2',
        hasDeleted: false,
        name: 'Tolerance B',
        type: 'Type 2',
        creatorId: 'User1',
        modifierId: 'User3',
        plannedEpld: '2024-11-30'
      },
    ];
    setTolerances(initialData);
  }, []);

  // Handle adding a new tolerance
  const handleAddTolerance = () => {
    const newToleranceData = { ...newTolerance };
    setTolerances([...tolerances, newToleranceData]);
    setNewTolerance({
      id: "",
      hasDeleted: false,
      name: "",
      type: "",
      creatorId: "",
      modifierId: "",
      plannedEpld: ""
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
      {/* Form for adding new tolerances */}
      <div className="mb-4">
        <TextField
          label="ID"
          variant="outlined"
          value={newTolerance.id}
          onChange={(e) => setNewTolerance({ ...newTolerance, id: e.target.value })}
          className="mr-2"
        />
        <TextField
          label="Name"
          variant="outlined"
          value={newTolerance.name}
          onChange={(e) => setNewTolerance({ ...newTolerance, name: e.target.value })}
          className="mr-2"
        />
        <TextField
          label="Type"
          variant="outlined"
          value={newTolerance.type}
          onChange={(e) => setNewTolerance({ ...newTolerance, type: e.target.value })}
          className="mr-2"
        />
        <TextField
          label="Creator ID"
          variant="outlined"
          value={newTolerance.creatorId}
          onChange={(e) => setNewTolerance({ ...newTolerance, creatorId: e.target.value })}
          className="mr-2"
        />
        <TextField
          label="Modifier ID"
          variant="outlined"
          value={newTolerance.modifierId}
          onChange={(e) => setNewTolerance({ ...newTolerance, modifierId: e.target.value })}
          className="mr-2"
        />
        <TextField
          label="Planned Epld"
          variant="outlined"
          value={newTolerance.plannedEpld}
          onChange={(e) => setNewTolerance({ ...newTolerance, plannedEpld: e.target.value })}
          className="mr-2"
        />
        <TextField
          label="Has Deleted"
          type="checkbox"
          checked={newTolerance.hasDeleted}
          onChange={(e) => setNewTolerance({ ...newTolerance, hasDeleted: e.target.checked })}
          className="mr-2"
        />
        <Button variant="contained" color="primary" onClick={handleAddTolerance}>
          Add Tolerance
        </Button>
      </div>

      {/* Tolerance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Has Deleted</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Creator ID</TableCell>
              <TableCell>Modifier ID</TableCell>
              <TableCell>Planned Epld</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tolerances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tolerance, index) => (
              <TableRow key={index}>
                <TableCell>{tolerance.id}</TableCell>
                <TableCell>{tolerance.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{tolerance.name}</TableCell>
                <TableCell>{tolerance.type}</TableCell>
                <TableCell>{tolerance.creatorId}</TableCell>
                <TableCell>{tolerance.modifierId}</TableCell>
                <TableCell>{tolerance.plannedEpld}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
