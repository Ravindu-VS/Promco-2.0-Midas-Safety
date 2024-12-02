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

const PlantDepartmentTable = () => {
  const [plantDepartments, setPlantDepartments] = useState([]);
  const [newPlantDepartment, setNewPlantDepartment] = useState({
    plantId: "",
    departmentId: "",
    plantName: "",
    departmentName: "",
    hasDeleted: false,
  });
  const [editingPlantDepartment, setEditingPlantDepartment] = useState(null); // To track the plant department being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        plantId: "P001",
        departmentId: "D001",
        plantName: "Plant A",
        departmentName: "Department 1",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
      {
        plantId: "P002",
        departmentId: "D002",
        plantName: "Plant B",
        departmentName: "Department 2",
        hasDeleted: false,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
      },
    ];
    setPlantDepartments(initialData);
  }, []);

  const handleAddPlantDepartment = () => {
    // Check if any required field is empty
    if (
      Object.entries(newPlantDepartment).some(
        ([key, value]) =>
          typeof value === "string" && value.trim() === "" && key !== "hasDeleted"
      )
    ) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newPlantDepartmentData = {
      ...newPlantDepartment,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing plant department
    if (editingPlantDepartment) {
      const updatedPlantDepartments = plantDepartments.map((plantDepartment) =>
        plantDepartment === editingPlantDepartment ? { ...newPlantDepartmentData } : plantDepartment
      );
      setPlantDepartments(updatedPlantDepartments);
      setEditingPlantDepartment(null); // Stop editing after save
    } else {
      // Add a new plant department to the list
      setPlantDepartments((prevPlantDepartments) => [
        ...prevPlantDepartments,
        newPlantDepartmentData,
      ]);
    }

    resetNewPlantDepartment(); // Clear input fields after adding or saving
  };

  const handleEditPlantDepartment = (plantDepartment) => {
    setEditingPlantDepartment(plantDepartment);
    setNewPlantDepartment({ ...plantDepartment }); // Populate the form fields with the current plant department's data
  };

  const handleDeletePlantDepartment = (plantDepartmentIndex) => {
    setPlantDepartments((prevPlantDepartments) =>
      prevPlantDepartments.filter((_, index) => index !== plantDepartmentIndex)
    );
  };

  const resetNewPlantDepartment = () => {
    setNewPlantDepartment({
      plantId: "",
      departmentId: "",
      plantName: "",
      departmentName: "",
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
      <h2 className="page-title">Plant Department Table</h2>

      {/* Form for adding/editing plant departments */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Plant ID"
            variant="outlined"
            value={newPlantDepartment.plantId}
            onChange={(e) =>
              setNewPlantDepartment({ ...newPlantDepartment, plantId: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Department ID"
            variant="outlined"
            value={newPlantDepartment.departmentId}
            onChange={(e) =>
              setNewPlantDepartment({ ...newPlantDepartment, departmentId: e.target.value })
            }
            className="input-field"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newPlantDepartment.hasDeleted}
                onChange={(e) =>
                  setNewPlantDepartment({ ...newPlantDepartment, hasDeleted: e.target.checked })
                }
              />
            }
            label="Has Deleted"
          />
          <TextField
            label="Plant Name"
            variant="outlined"
            value={newPlantDepartment.plantName}
            onChange={(e) =>
              setNewPlantDepartment({ ...newPlantDepartment, plantName: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Department Name"
            variant="outlined"
            value={newPlantDepartment.departmentName}
            onChange={(e) =>
              setNewPlantDepartment({ ...newPlantDepartment, departmentName: e.target.value })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Plant Department"
          onClick={handleAddPlantDepartment}
        >
          {editingPlantDepartment ? "Save Changes" : "Add Plant Department"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Plant ID</StyledTableCell>
            <StyledTableCell>Department ID</StyledTableCell>
            <StyledTableCell>Plant Name</StyledTableCell>
            <StyledTableCell>Department Name</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plantDepartments
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((plantDepartment, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{plantDepartment.plantId}</TableCell>
                <TableCell>{plantDepartment.departmentId}</TableCell>
                <TableCell>{plantDepartment.plantName}</TableCell>
                <TableCell>{plantDepartment.departmentName}</TableCell>
                <TableCell>{plantDepartment.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeletePlantDepartment(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditPlantDepartment(plantDepartment)}
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
        count={plantDepartments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default PlantDepartmentTable;
