import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField, // Add this line
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

const PlantDeptAbpUserTable = () => {
  const [plantDeptAbpUsers, setPlantDeptAbpUsers] = useState([]);
  const [newPlantDeptAbpUser, setNewPlantDeptAbpUser] = useState({
    abpUserId: "",
    plantDepartmentId: "",
  });
  const [editingPlantDeptAbpUser, setEditingPlantDeptAbpUser] = useState(null); // To track the plant department ABP user being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        abpUserId: "ABP001",
        plantDepartmentId: "PD001",
      },
      {
        abpUserId: "ABP002",
        plantDepartmentId: "PD002",
      },
    ];
    setPlantDeptAbpUsers(initialData);
  }, []);

  const handleAddPlantDeptAbpUser = () => {
    // Check if any required field is empty
    if (
      Object.entries(newPlantDeptAbpUser).some(
        ([key, value]) => value.trim() === ""
      )
    ) {
      console.log("Please fill all fields before adding.");
      return;
    }

    // If editing, update the existing plant department ABP user
    if (editingPlantDeptAbpUser) {
      const updatedPlantDeptAbpUsers = plantDeptAbpUsers.map((plantDeptAbpUser) =>
        plantDeptAbpUser === editingPlantDeptAbpUser
          ? { ...newPlantDeptAbpUser }
          : plantDeptAbpUser
      );
      setPlantDeptAbpUsers(updatedPlantDeptAbpUsers);
      setEditingPlantDeptAbpUser(null); // Stop editing after save
    } else {
      // Add a new plant department ABP user to the list
      setPlantDeptAbpUsers((prevPlantDeptAbpUsers) => [
        ...prevPlantDeptAbpUsers,
        newPlantDeptAbpUser,
      ]);
    }

    resetNewPlantDeptAbpUser(); // Clear input fields after adding or saving
  };

  const handleEditPlantDeptAbpUser = (plantDeptAbpUser) => {
    setEditingPlantDeptAbpUser(plantDeptAbpUser);
    setNewPlantDeptAbpUser({ ...plantDeptAbpUser }); // Populate the form fields with the current plant department ABP user's data
  };

  const handleDeletePlantDeptAbpUser = (plantDeptAbpUserIndex) => {
    setPlantDeptAbpUsers((prevPlantDeptAbpUsers) =>
      prevPlantDeptAbpUsers.filter((_, index) => index !== plantDeptAbpUserIndex)
    );
  };

  const resetNewPlantDeptAbpUser = () => {
    setNewPlantDeptAbpUser({
      abpUserId: "",
      plantDepartmentId: "",
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
      <h2 className="page-title">Plant Department ABP User Table</h2>

      {/* Form for adding/editing plant department ABP users */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="ABP User ID"
            variant="outlined"
            value={newPlantDeptAbpUser.abpUserId}
            onChange={(e) =>
              setNewPlantDeptAbpUser({
                ...newPlantDeptAbpUser,
                abpUserId: e.target.value,
              })
            }
            className="input-field"
          />
          <TextField
            label="Plant Department ID"
            variant="outlined"
            value={newPlantDeptAbpUser.plantDepartmentId}
            onChange={(e) =>
              setNewPlantDeptAbpUser({
                ...newPlantDeptAbpUser,
                plantDepartmentId: e.target.value,
              })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Plant Department ABP User"
          onClick={handleAddPlantDeptAbpUser}
        >
          {editingPlantDeptAbpUser ? "Save Changes" : "Add Plant Dept ABP User"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>ABP User ID</StyledTableCell>
            <StyledTableCell>Plant Department ID</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plantDeptAbpUsers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((plantDeptAbpUser, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{plantDeptAbpUser.abpUserId}</TableCell>
                <TableCell>{plantDeptAbpUser.plantDepartmentId}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeletePlantDeptAbpUser(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditPlantDeptAbpUser(plantDeptAbpUser)}
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
        count={plantDeptAbpUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default PlantDeptAbpUserTable;
