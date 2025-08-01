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

const MaterialCodeTable = () => {
  const [materialCodes, setMaterialCodes] = useState([]);
  const [newMaterialCode, setNewMaterialCode] = useState({
    materialCode: "",
    hasDeleted: false,
    plantDepld: "",
  });
  const [editingMaterialCode, setEditingMaterialCode] = useState(null); // To track the material code being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        materialCode: "MAT-001",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plantDepld: "Plant A",
      },
      {
        materialCode: "MAT-002",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plantDepld: "Plant B",
      },
    ];
    setMaterialCodes(initialData);
  }, []);

  const handleAddMaterialCode = () => {
    // Check if any required field is empty
    if (
      Object.entries(newMaterialCode).some(
        ([key, value]) => key !== "hasDeleted" && value.trim() === ""
      )
    ) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newMaterialCodeData = {
      ...newMaterialCode,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing material code
    if (editingMaterialCode) {
      const updatedMaterialCodes = materialCodes.map((materialCode) =>
        materialCode === editingMaterialCode ? { ...newMaterialCodeData } : materialCode
      );
      setMaterialCodes(updatedMaterialCodes);
      setEditingMaterialCode(null); // Stop editing after save
    } else {
      // Add a new material code to the list
      setMaterialCodes((prevMaterialCodes) => [...prevMaterialCodes, newMaterialCodeData]);
    }

    resetNewMaterialCode(); // Clear input fields after adding or saving
  };

  const handleEditMaterialCode = (materialCode) => {
    setEditingMaterialCode(materialCode);
    setNewMaterialCode({ ...materialCode }); // Populate the form fields with the current material code's data
  };

  const handleDeleteMaterialCode = (materialCodeIndex) => {
    setMaterialCodes((prevMaterialCodes) =>
      prevMaterialCodes.filter((_, index) => index !== materialCodeIndex)
    );
  };

  const resetNewMaterialCode = () => {
    setNewMaterialCode({
      materialCode: "",
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
      <h2 className="page-title">Material Code Table</h2>

      {/* Form for adding/editing material codes */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Material Code"
            variant="outlined"
            value={newMaterialCode.materialCode}
            onChange={(e) =>
              setNewMaterialCode({ ...newMaterialCode, materialCode: e.target.value })
            }
            className="input-field"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newMaterialCode.hasDeleted}
                onChange={(e) =>
                  setNewMaterialCode({ ...newMaterialCode, hasDeleted: e.target.checked })
                }
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="Plant Depld"
            variant="outlined"
            value={newMaterialCode.plantDepld}
            onChange={(e) =>
              setNewMaterialCode({ ...newMaterialCode, plantDepld: e.target.value })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Material Code"
          onClick={handleAddMaterialCode}
        >
          {editingMaterialCode ? "Save Changes" : "Add Material Code"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>Material Code</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Plant Depld</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materialCodes
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((materialCode, index) => (
              <TableRow key={index}>
                <TableCell>{materialCode.materialCode}</TableCell>
                <TableCell>{materialCode.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{new Date(materialCode.createdTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(materialCode.modifiedTime).toLocaleString()}</TableCell>
                <TableCell>{materialCode.plantDepld}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteMaterialCode(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditMaterialCode(materialCode)}
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
        count={materialCodes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default MaterialCodeTable;
