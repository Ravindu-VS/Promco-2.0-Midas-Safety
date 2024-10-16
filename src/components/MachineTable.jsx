import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, Button } from "@mui/material";
import './MachineTable.css'; // Import the CSS file

const MachineTable = () => {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState({
    machineCode: "",
    machineType: "",
    sapResource: "",
    hasDeleted: false,
    createdTime: "",
    modifiedTime: "",
    plannedEpld: ""
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const initialData = [
      {
        machineCode: 'PMP-PU',
        machineType: 'KNT',
        sapResource: 'NULL',
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: '24'
      },
      {
        machineCode: 'PMP1-PU',
        machineType: 'KNT',
        sapResource: 'NULL',
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: '24'
      },
    ];
    setMachines(initialData);
  }, []);

  const handleAddMachine = () => {
    const newMachineData = {
      ...newMachine,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString()
    };
    setMachines([...machines, newMachineData]);
    setNewMachine({
      machineCode: "",
      machineType: "",
      sapResource: "",
      hasDeleted: false,
      createdTime: "",
      modifiedTime: "",
      plannedEpld: ""
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
    <div className="machine-table">
      <div className="form-container">
        <TextField
          label="Machine Code"
          variant="outlined"
          value={newMachine.machineCode}
          onChange={(e) => setNewMachine({ ...newMachine, machineCode: e.target.value })}
          className="form-input"
        />
        <TextField
          label="Machine Type"
          variant="outlined"
          value={newMachine.machineType}
          onChange={(e) => setNewMachine({ ...newMachine, machineType: e.target.value })}
          className="form-input"
        />
        <TextField
          label="SAP Resource"
          variant="outlined"
          value={newMachine.sapResource}
          onChange={(e) => setNewMachine({ ...newMachine, sapResource: e.target.value })}
          className="form-input"
        />
        <TextField
          label="Has Deleted"
          type="checkbox"
          checked={newMachine.hasDeleted}
          onChange={(e) => setNewMachine({ ...newMachine, hasDeleted: e.target.checked })}
          className="form-checkbox"
        />
        <TextField
          label="Planned Epld"
          variant="outlined"
          value={newMachine.plannedEpld}
          onChange={(e) => setNewMachine({ ...newMachine, plannedEpld: e.target.value })}
          className="form-input"
        />
        <Button variant="contained" color="primary" onClick={handleAddMachine}>
          Add Machine
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Machine Code</TableCell>
              <TableCell>Machine Type</TableCell>
              <TableCell>SAP Resource</TableCell>
              <TableCell>Has Deleted</TableCell>
              <TableCell>Created Time</TableCell>
              <TableCell>Modified Time</TableCell>
              <TableCell>Planned Epld</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((machine, index) => (
              <TableRow key={index}>
                <TableCell>{machine.machineCode}</TableCell>
                <TableCell>{machine.machineType}</TableCell>
                <TableCell>{machine.sapResource}</TableCell>
                <TableCell>{machine.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{machine.createdTime}</TableCell>
                <TableCell>{machine.modifiedTime}</TableCell>
                <TableCell>{machine.plannedEpld}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
