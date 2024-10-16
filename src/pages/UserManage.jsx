import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import './UserManage.css'; // Import the CSS file for styling

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    password: '', // Add password to user state
  });

  useEffect(() => {
    // Fetch initial user data (mocked for demonstration)
    const initialUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'manager', password: '1234' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'operator', password: '5678' },
    ];
    setUsers(initialUsers);
  }, []);

  // Handle adding a new user
  const handleAddUser = () => {
    if (currentUser.name && currentUser.email && currentUser.role && currentUser.password) {
      setUsers([...users, { ...currentUser, id: Date.now().toString() }]);
      setOpenAddDialog(false);
      setCurrentUser({ id: '', name: '', email: '', role: '', password: '' });
    }
  };

  // Handle editing an existing user
  const handleEditUser = () => {
    setUsers(
      users.map((user) => (user.id === currentUser.id ? currentUser : user))
    );
    setOpenEditDialog(false);
    setCurrentUser({ id: '', name: '', email: '', role: '', password: '' });
  };

  // Handle deleting a user
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Open dialog to add a new user
  const openAddUserDialog = () => {
    setCurrentUser({ id: '', name: '', email: '', role: '', password: '' });
    setOpenAddDialog(true);
  };

  // Open dialog to edit an existing user
  const openEditUserDialog = (user) => {
    setCurrentUser(user);
    setOpenEditDialog(true);
  };

  return (
    <div className="user-manage-container">
      <h1>User Management</h1>
      <Button variant="contained" className="add-button" onClick={openAddUserDialog}>
        Add User
      </Button>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header-cell">Name</TableCell>
              <TableCell className="table-header-cell">Email</TableCell>
              <TableCell className="table-header-cell">Role</TableCell>
              <TableCell className="table-header-cell">Password</TableCell> {/* Show Password */}
              <TableCell className="table-header-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="table-cell">{user.name}</TableCell>
                <TableCell className="table-cell">{user.email}</TableCell>
                <TableCell className="table-cell">{user.role}</TableCell>
                <TableCell className="table-cell">{user.password}</TableCell> {/* Show Password */}
                <TableCell className="table-cell">
                  <IconButton
                    color="primary"
                    onClick={() => openEditUserDialog(user)}
                  >
                    <EditIcon className="action-icon" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <DeleteIcon className="action-icon" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle className="dialog-title">Add User</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            label="Name"
            value={currentUser.name}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, name: e.target.value })
            }
            fullWidth
            className="dialog-input"
          />
          <TextField
            label="Email"
            value={currentUser.email}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.target.value })
            }
            fullWidth
            className="dialog-input"
          />
          <FormControl fullWidth className="dialog-input">
            <InputLabel>Role</InputLabel>
            <Select
              value={currentUser.role}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, role: e.target.value })
              }
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="operator">Operator</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          {/* Password Field */}
          <TextField
            label="Password"
            type="password"
            value={currentUser.password}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, password: e.target.value })
            }
            fullWidth
            className="dialog-input"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddDialog(false)}
            className="cancel-button"
          >
            Cancel
          </Button>
          <Button onClick={handleAddUser} className="save-button">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle className="dialog-title">Edit User</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            label="Name"
            value={currentUser.name}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, name: e.target.value })
            }
            fullWidth
            className="dialog-input"
          />
          <TextField
            label="Email"
            value={currentUser.email}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.target.value })
            }
            fullWidth
            className="dialog-input"
          />
          <FormControl fullWidth className="dialog-input">
            <InputLabel>Role</InputLabel>
            <Select
              value={currentUser.role}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, role: e.target.value })
              }
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="operator">Operator</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          {/* Password Field */}
          <TextField
            label="Password"
            type="password"
            value={currentUser.password}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, password: e.target.value })
            }
            fullWidth
            className="dialog-input"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEditDialog(false)}
            className="cancel-button"
          >
            Cancel
          </Button>
          <Button onClick={handleEditUser} className="save-button">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManage;
