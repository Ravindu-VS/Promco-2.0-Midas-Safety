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
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './UserManage.css';
import userService from '../services/userService';
import { getCurrentUser } from '../services/authService';

const EMPTY_USER = { id: '', username: '', email: '', role: '', password: '', profilePicture: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserManage = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(EMPTY_USER);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Access control is handled by the <RequireAuth roles={['admin']}> route guard.
    const fetchUsers = async () => {
      setLoading(true);
      const result = await userService.getAllUsers();
      if (result.success) {
        setUserList(result.data);
      } else {
        setUserList([]);
        setAlert({ open: true, message: result.error || 'Failed to load users', severity: 'error' });
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const validate = (user, { requirePassword }) => {
    if (!user.username.trim() || !user.email.trim() || !user.role || (requirePassword && !user.password)) {
      return 'Please fill in all required fields';
    }
    if (!EMAIL_RE.test(user.email)) {
      return 'Please enter a valid email address';
    }
    if (user.password && user.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  // Helper functions for managing users

  const handleAddUser = async () => {
    const validationError = validate(currentUser, { requirePassword: true });
    if (validationError) {
      setAlert({ open: true, message: validationError, severity: 'error' });
      return;
    }
    
    try {
      const userData = {
        username: currentUser.username,
        email: currentUser.email,
        password: currentUser.password,
        role: currentUser.role,
        profilePicture: currentUser.profilePicture || null
      };
      
      const result = await userService.createUser(userData);
      
      if (result.success) {
        const { password, ...safeUser } = userData;
        const newUser = { ...safeUser, ...result.data };

        setUserList((prev) => [...prev, newUser]);
        setOpenAddDialog(false);
        setCurrentUser(EMPTY_USER);
        
        setAlert({ 
          open: true, 
          message: 'User created successfully', 
          severity: 'success' 
        });
      } else {
        setAlert({ 
          open: true, 
          message: result.error || 'Failed to create user', 
          severity: 'error' 
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setAlert({ 
        open: true, 
        message: 'An error occurred while creating the user', 
        severity: 'error' 
      });
    }
  };

  const handleEditUser = async () => {
    const validationError = validate(currentUser, { requirePassword: false });
    if (validationError) {
      setAlert({ open: true, message: validationError, severity: 'error' });
      return;
    }
    try {
      const userData = {
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        profilePicture: currentUser.profilePicture || null
      };
      
      // Only send a password when the admin typed a new one
      if (currentUser.password) {
        userData.password = currentUser.password;
      }
      
      const result = await userService.updateUser(currentUser.id, userData);
      
      if (result.success) {
        // Update the user in the list
        const { password, ...safeData } = userData;
        setUserList((prev) =>
          prev.map((user) => (user.id === currentUser.id ? { ...user, ...safeData } : user))
        );
        setOpenEditDialog(false);
        setCurrentUser(EMPTY_USER);
        
        setAlert({ 
          open: true, 
          message: 'User updated successfully', 
          severity: 'success' 
        });
      } else {
        setAlert({ 
          open: true, 
          message: result.error || 'Failed to update user', 
          severity: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert({ 
        open: true, 
        message: 'An error occurred while updating the user', 
        severity: 'error' 
      });
    }
  };

  const handleDeleteUser = async (user) => {
    if (String(user.id) === String(getCurrentUser()?.id)) {
      setAlert({ open: true, message: 'You cannot delete your own account', severity: 'warning' });
      return;
    }
    if (!window.confirm(`Delete user "${user.username}"? This cannot be undone.`)) {
      return;
    }
    const id = user.id;
    try {
      const result = await userService.deleteUser(id);
      
      if (result.success) {
        // Remove the user from the list
        setUserList((prev) => prev.filter((u) => u.id !== id));
        
        setAlert({ 
          open: true, 
          message: 'User deleted successfully', 
          severity: 'success' 
        });
      } else {
        setAlert({ 
          open: true, 
          message: result.error || 'Failed to delete user', 
          severity: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert({ 
        open: true, 
        message: 'An error occurred while deleting the user', 
        severity: 'error' 
      });
    }
  };

  const openAddUserDialog = () => {
    setCurrentUser(EMPTY_USER);
    setOpenAddDialog(true);
  };

  const openEditUserDialog = (user) => {
    // Never pre-fill the password field; leave blank to keep the current password
    setCurrentUser({ ...EMPTY_USER, ...user, password: '' });
    setOpenEditDialog(true);
  };

  // Open a read-only profile view without touching the logged-in user's session
  const handleViewProfile = (user) => {
    navigate('/profile', { state: { user } });
  };


  const term = searchTerm.toLowerCase();
  const filteredUsers = userList.filter((user) =>
    (user.username || '').toLowerCase().includes(term) ||
    (user.email || '').toLowerCase().includes(term) ||
    (user.role || '').toLowerCase().includes(term)
  );

  const getInitials = (name = '') =>
    name
      .split(/[\s_.-]+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentUser({ ...currentUser, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="user-manage-container">
      <h2 className="page-title">User Management</h2>
      <div className="toolbar">
        <TextField
          label="Search users"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <Button 
          variant="contained" 
          className="add-button" 
          onClick={openAddUserDialog}
          disabled={loading}
        >
          Add User
        </Button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
          <p>Loading users...</p>
        </div>
      ) : (
        <TableContainer component={Paper} className="user-table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header-cell">Profile</TableCell>
              <TableCell className="table-header-cell">User ID</TableCell>
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
                    <img src={user.profilePicture} alt="Profile" className="profile-thumbnail" />
                  ) : (
                    <div className="profile-initials">
                      {getInitials(user.username)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="table-cell">{user.id}</TableCell>
                <TableCell className="table-cell">{user.username}</TableCell>
                <TableCell className="table-cell">{user.email}</TableCell>
                <TableCell className="table-cell">{user.role}</TableCell>
                <TableCell className="table-cell">
                  <IconButton color="primary" aria-label={`Edit ${user.username}`} onClick={() => openEditUserDialog(user)}>
                    <EditIcon className="action-icon" />
                  </IconButton>
                  <IconButton color="secondary" aria-label={`Delete ${user.username}`} onClick={() => handleDeleteUser(user)}>
                    <DeleteIcon className="action-icon" />
                  </IconButton>
                  <IconButton color="default" aria-label={`View ${user.username}`} onClick={() => handleViewProfile(user)}>
                    <Visibility className="action-icon" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="table-cell" align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </TableContainer>
      )}
      
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
            type="email"
            value={currentUser.email}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <FormControl fullWidth className="dialog-input">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              value={currentUser.role}
              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="technician">Technician</MenuItem>
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
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleAddUser} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle className="dialog-title">Edit User</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            label="User ID"
            value={currentUser.id}
            disabled
            fullWidth
            className="dialog-input"
          />
          <TextField
            label="Username"
            value={currentUser.username}
            onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <TextField
            label="Email"
            type="email"
            value={currentUser.email}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <FormControl fullWidth className="dialog-input">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              value={currentUser.role}
              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="technician">Technician</MenuItem>
              <MenuItem value="operator">Operator</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="New password"
            helperText="Leave blank to keep the current password"
            type="password"
            value={currentUser.password}
            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
            fullWidth
            className="dialog-input"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleEditUser} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={() => setAlert({...alert, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlert({...alert, open: false})} 
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserManage;
