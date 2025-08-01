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
import { Edit as EditIcon, Delete as DeleteIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './UserManage.css';
import { userService } from '../services/apiService';
import { getCurrentUser, isAuthenticated } from '../services/authService';

const UserManage = () => {
  const navigate = useNavigate();
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
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const checkAuth = () => {
      if (!isAuthenticated()) {
        setAlert({ 
          open: true, 
          message: 'You must be logged in to access this page', 
          severity: 'error' 
        });
        navigate('/');
        return false;
      }
      
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.role !== 'admin') {
        setAlert({ 
          open: true, 
          message: 'You do not have permission to access this page', 
          severity: 'error' 
        });
        navigate('/dashboard');
        return false;
      }
      
      return true;
    };
    
    // Fetch users from the API
    const fetchUsers = async () => {
      if (!checkAuth()) return;
      
      setLoading(true);
      try {
        const result = await userService.getAllUsers();
        
        if (result.success) {
          setUserList(result.data);
        } else {
          // Fallback to sample data if API fails
          console.log('Falling back to sample user data');
          const sampleUsers = [
            { id: '1', username: 'john_doe', email: 'admin@example.com', role: 'admin', password: '******', profilePicture: '' },
            { id: '2', username: 'jane_smith', email: 'manager@example.com', role: 'manager', password: '******', profilePicture: '' },
            { id: '3', username: 'michael_jordan', email: 'operator@example.com', role: 'operator', password: '******', profilePicture: '' },
            { id: '4', username: 'emily_clark', email: 'user@example.com', role: 'user', password: '******', profilePicture: '' },
          ];
          setUserList(sampleUsers);
        }
      } catch (error) {
        setAlert({ 
          open: true, 
          message: 'Failed to load users. Using sample data instead.', 
          severity: 'warning' 
        });
        
        // Fallback to sample data
        const sampleUsers = [
          { id: '1', username: 'john_doe', email: 'admin@example.com', role: 'admin', password: '******', profilePicture: '' },
          { id: '2', username: 'jane_smith', email: 'manager@example.com', role: 'manager', password: '******', profilePicture: '' },
          { id: '3', username: 'michael_jordan', email: 'operator@example.com', role: 'operator', password: '******', profilePicture: '' },
          { id: '4', username: 'emily_clark', email: 'user@example.com', role: 'user', password: '******', profilePicture: '' },
        ];
        setUserList(sampleUsers);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [navigate]);

  // Helper functions for managing users

  const handleAddUser = async () => {
    if (!currentUser.username || !currentUser.email || !currentUser.role || !currentUser.password) {
      setAlert({ 
        open: true, 
        message: 'Please fill in all required fields', 
        severity: 'error' 
      });
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
        // Add the new user to the list with the ID from the API
        const newUser = { 
          id: result.data.userId,
          ...userData
        };
        
        setUserList([...userList, newUser]);
        setOpenAddDialog(false);
        setCurrentUser({ id: '', username: '', email: '', role: '', password: '', profilePicture: '' });
        
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
    try {
      const userData = {
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        profilePicture: currentUser.profilePicture || null
      };
      
      // Only include password if it's changed (not ******)
      if (currentUser.password && currentUser.password !== '******') {
        userData.password = currentUser.password;
      }
      
      const result = await userService.updateUser(currentUser.id, userData);
      
      if (result.success) {
        // Update the user in the list
        const updatedUserList = userList.map(user => 
          user.id === currentUser.id ? { ...user, ...userData } : user
        );
        
        setUserList(updatedUserList);
        setOpenEditDialog(false);
        setCurrentUser({ id: '', username: '', email: '', role: '', password: '', profilePicture: '' });
        
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

  const handleDeleteUser = async (id) => {
    try {
      const result = await userService.deleteUser(id);
      
      if (result.success) {
        // Remove the user from the list
        const updatedUserList = userList.filter(user => user.id !== id);
        setUserList(updatedUserList);
        
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
    setCurrentUser({ id: '', username: '', email: '', role: '', password: '', profilePicture: '' });
    setOpenAddDialog(true);
  };

  const openEditUserDialog = (user) => {
    setCurrentUser(user);
    setOpenEditDialog(true);
  };

      // When navigating to profile
  const handleViewProfile = (id) => {
    const user = userList.find((user) => user.id === id);
    localStorage.setItem('user', JSON.stringify(user)); // Save selected user data to local storage      navigate(`/profile/${id}`);
    };


  const filteredUsers = userList.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    const initials = name.split(' ').map((word) => word[0]).join('');
    return initials.toUpperCase();
  };

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
          label="Search Users"
          variant="outlined"
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header-cell">Profile</TableCell>
              <TableCell className="table-header-cell">User ID</TableCell>
              <TableCell className="table-header-cell">Username</TableCell>
              <TableCell className="table-header-cell">Email</TableCell>
              <TableCell className="table-header-cell">Role</TableCell>
              <TableCell className="table-header-cell">
                Password
                <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </TableCell>
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
                  {showPassword ? user.password : '******'}
                </TableCell>
                <TableCell className="table-cell">
                  <IconButton color="primary" onClick={() => openEditUserDialog(user)}>
                    <EditIcon className="action-icon" />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon className="action-icon" />
                  </IconButton>
                  <IconButton color="default" onClick={() => handleViewProfile(user.id)}>
                    <Visibility className="action-icon" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle className="dialog-title">Add User</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            label="User ID"
            value={currentUser.id}
            onChange={(e) => setCurrentUser({ ...currentUser, id: e.target.value })}
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
          <input type="file" onChange={handleImageChange} />
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
          <input type="file" onChange={handleImageChange} />
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
