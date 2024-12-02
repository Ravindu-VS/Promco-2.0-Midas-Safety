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

const ParameterQualifiedValueTable = () => {
  const [qualifiedValues, setQualifiedValues] = useState([]);
  const [newQualifiedValue, setNewQualifiedValue] = useState({
    id: "",
    plantDepld: "",
    materialCode: "",
    parameter: "",
    minValue: "",
    targetValue: "",
    maxValue: "",
  });
  const [editingQualifiedValue, setEditingQualifiedValue] = useState(null); // To track the qualified value being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        id: "1",
        plantDepld: "Plant A",
        materialCode: "M001",
        parameter: "Temperature",
        minValue: "20",
        targetValue: "50",
        maxValue: "80",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
      {
        id: "2",
        plantDepld: "Plant B",
        materialCode: "M002",
        parameter: "Pressure",
        minValue: "5",
        targetValue: "50",
        maxValue: "100",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
    ];
    setQualifiedValues(initialData);
  }, []);

  const handleAddQualifiedValue = () => {
    // Check if any required field is empty
    if (
      Object.entries(newQualifiedValue).some(
        ([key, value]) => value.trim() === ""
      )
    ) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newQualifiedValueData = {
      ...newQualifiedValue,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing qualified value
    if (editingQualifiedValue) {
      const updatedQualifiedValues = qualifiedValues.map((value) =>
        value === editingQualifiedValue ? { ...newQualifiedValueData } : value
      );
      setQualifiedValues(updatedQualifiedValues);
      setEditingQualifiedValue(null); // Stop editing after save
    } else {
      // Add a new qualified value to the list
      setQualifiedValues((prevQualifiedValues) => [
        ...prevQualifiedValues,
        newQualifiedValueData,
      ]);
    }

    resetNewQualifiedValue(); // Clear input fields after adding or saving
  };

  const handleEditQualifiedValue = (qualifiedValue) => {
    setEditingQualifiedValue(qualifiedValue);
    setNewQualifiedValue({ ...qualifiedValue }); // Populate the form fields with the current value's data
  };

  const handleDeleteQualifiedValue = (qualifiedValueIndex) => {
    setQualifiedValues((prevQualifiedValues) =>
      prevQualifiedValues.filter((_, index) => index !== qualifiedValueIndex)
    );
  };

  const resetNewQualifiedValue = () => {
    setNewQualifiedValue({
      id: "",
      plantDepld: "",
      materialCode: "",
      parameter: "",
      minValue: "",
      targetValue: "",
      maxValue: "",
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
      <h2 className="page-title">Parameter Qualified Value Table</h2>

      {/* Form for adding/editing qualified values */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="ID"
            variant="outlined"
            value={newQualifiedValue.id}
            onChange={(e) =>
              setNewQualifiedValue({ ...newQualifiedValue, id: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Plant Depld"
            variant="outlined"
            value={newQualifiedValue.plantDepld}
            onChange={(e) =>
              setNewQualifiedValue({ ...newQualifiedValue, plantDepld: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Material Code"
            variant="outlined"
            value={newQualifiedValue.materialCode}
            onChange={(e) =>
              setNewQualifiedValue({ ...newQualifiedValue, materialCode: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Parameter"
            variant="outlined"
            value={newQualifiedValue.parameter}
            onChange={(e) =>
              setNewQualifiedValue({ ...newQualifiedValue, parameter: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Min Value"
            variant="outlined"
            value={newQualifiedValue.minValue}
            onChange={(e) =>
              setNewQualifiedValue({ ...newQualifiedValue, minValue: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Target Value"
            variant="outlined"
            value={newQualifiedValue.targetValue}
            onChange={(e) =>
              setNewQualifiedValue({ ...newQualifiedValue, targetValue: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Max Value"
            variant="outlined"
            value={newQualifiedValue.maxValue}
            onChange={(e) =>
              setNewQualifiedValue({ ...newQualifiedValue, maxValue: e.target.value })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Qualified Value"
          onClick={handleAddQualifiedValue}
        >
          {editingQualifiedValue ? "Save Changes" : "Add Qualified Value"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Plant Depld</StyledTableCell>
            <StyledTableCell>Material Code</StyledTableCell>
            <StyledTableCell>Parameter</StyledTableCell>
            <StyledTableCell>Min Value</StyledTableCell>
            <StyledTableCell>Target Value</StyledTableCell>
            <StyledTableCell>Max Value</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qualifiedValues
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((qualifiedValue, index) => (
              <TableRow key={index}>
                <TableCell>{qualifiedValue.id}</TableCell>
                <TableCell>{qualifiedValue.plantDepld}</TableCell>
                <TableCell>{qualifiedValue.materialCode}</TableCell>
                <TableCell>{qualifiedValue.parameter}</TableCell>
                <TableCell>{qualifiedValue.minValue}</TableCell>
                <TableCell>{qualifiedValue.targetValue}</TableCell>
                <TableCell>{qualifiedValue.maxValue}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteQualifiedValue(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditQualifiedValue(qualifiedValue)}
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
        count={qualifiedValues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ParameterQualifiedValueTable;
