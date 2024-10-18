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
import './UserManage.css';

const UserManage = () => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
    password: '',
    profilePicture: '',
  });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (storedUsers.length === 0) {
      const exampleUsers = [
        { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', password: 'admin123', profilePicture: 'https://via.placeholder.com/50' },
        { id: '2', username: 'manager', email: 'manager@example.com', role: 'manager', password: 'manager123', profilePicture: 'https://via.placeholder.com/50' },
        { id: '3', username: 'operator', email: 'operator@example.com', role: 'operator', password: 'operator123', profilePicture: 'https://via.placeholder.com/50' },
        { id: '4', username: 'user', email: 'user@example.com', role: 'user', password: 'user123', profilePicture: 'https://via.placeholder.com/50' },
      ];
      localStorage.setItem('users', JSON.stringify(exampleUsers));
      setUserList(exampleUsers);
    } else {
      setUserList(storedUsers);
    }
  }, []);

  const saveUsersToLocalStorage = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleAddUser = () => {
    if (currentUser.username && currentUser.email && currentUser.role && currentUser.password) {
      const newUser = { ...currentUser, id: Date.now().toString() };
      const updatedUserList = [...userList, newUser];
      setUserList(updatedUserList);
      saveUsersToLocalStorage(updatedUserList);
      setOpenAddDialog(false);
      setCurrentUser({ id: '', username: '', email: '', role: '', password: '', profilePicture: '' });
    }
  };

  const handleEditUser = () => {
    const updatedUserList = userList.map((user) => (user.id === currentUser.id ? currentUser : user));
    setUserList(updatedUserList);
    saveUsersToLocalStorage(updatedUserList);
    setOpenEditDialog(false);
    setCurrentUser({ id: '', username: '', email: '', role: '', password: '', profilePicture: '' });
  };

  const handleDeleteUser = (id) => {
    const updatedUserList = userList.filter((user) => user.id !== id);
    setUserList(updatedUserList);
    saveUsersToLocalStorage(updatedUserList);
  };

  const openAddUserDialog = () => {
    setCurrentUser({ id: '', username: '', email: '', role: '', password: '', profilePicture: '' });
    setOpenAddDialog(true);
  };

  const openEditUserDialog = (user) => {
    setCurrentUser(user);
    setOpenEditDialog(true);
  };

  const filteredUsers = userList.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-manage-container">
      <h1>User Management</h1>
      <div className="toolbar">
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <Button variant="contained" className="add-button" onClick={openAddUserDialog}>
          Add User
        </Button>
      </div>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header-cell">Profile Picture</TableCell>
              <TableCell className="table-header-cell">Username</TableCell>
              <TableCell className="table-header-cell">Email</TableCell>
              <TableCell className="table-header-cell">Role</TableCell>
              <TableCell className="table-header-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="table-cell">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={`${user.username}'s profile`}
                      className="profile-picture"
                    />
                  ) : (
                    <div className="profile-initials">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="table-cell">{user.username}</TableCell>
                <TableCell className="table-cell">{user.email}</TableCell>
                <TableCell className="table-cell">{user.role}</TableCell>
                <TableCell className="table-cell">
                  <IconButton color="primary" onClick={() => openEditUserDialog(user)}>
                    <EditIcon className="action-icon" />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteUser(user.id)}>
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
            label="Username"
            value={currentUser.username}
            onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <TextField
            label="Email"
            value={currentUser.email}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <FormControl fullWidth className="dialog-input">
            <InputLabel>Role</InputLabel>
            <Select
              value={currentUser.role}
              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="operator">Operator</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Password"
            type="password"
            value={currentUser.password}
            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <TextField
            label="Profile Picture URL"
            value={currentUser.profilePicture}
            onChange={(e) => setCurrentUser({ ...currentUser, profilePicture: e.target.value })}
            fullWidth
            className="dialog-input"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} className="cancel-button">
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
            label="Username"
            value={currentUser.username}
            onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <TextField
            label="Email"
            value={currentUser.email}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <FormControl fullWidth className="dialog-input">
            <InputLabel>Role</InputLabel>
            <Select
              value={currentUser.role}
              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="operator">Operator</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Password"
            type="password"
            value={currentUser.password}
            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <TextField
            label="Profile Picture URL"
            value={currentUser.profilePicture}
            onChange={(e) => setCurrentUser({ ...currentUser, profilePicture: e.target.value })}
            fullWidth
            className="dialog-input"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} className="cancel-button">
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
