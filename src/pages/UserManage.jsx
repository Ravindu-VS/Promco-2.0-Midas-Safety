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
import { Edit as EditIcon, Delete as DeleteIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './UserManage.css';

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

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (storedUsers && storedUsers.length > 0) {
      setUserList(storedUsers);
    } else {
      const sampleUsers = [
        { id: '1', username: 'john_doe', email: 'john.doe@example.com', role: 'admin', password: 'password123', profilePicture: '' },
        { id: '2', username: 'jane_smith', email: 'jane.smith@example.com', role: 'manager', password: 'password123', profilePicture: '' },
        { id: '3', username: 'michael_jordan', email: 'michael.jordan@example.com', role: 'operator', password: 'password123', profilePicture: '' },
        { id: '4', username: 'emily_clark', email: 'emily.clark@example.com', role: 'user', password: 'password123', profilePicture: '' },
      ];
      setUserList(sampleUsers);
      saveUsersToLocalStorage(sampleUsers);
    }
  }, []);

  const saveUsersToLocalStorage = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleAddUser = () => {
    if (currentUser.id && currentUser.username && currentUser.email && currentUser.role && currentUser.password) {
      const newUser = { ...currentUser };
      const updatedUserList = [...userList, newUser];
      setUserList(updatedUserList);
      saveUsersToLocalStorage(updatedUserList);
      setOpenAddDialog(false);
      setCurrentUser({ id: '', username: '', email: '', role: '', password: '', profilePicture: '' });
    } else {
      alert('Please fill in all fields');
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
      </TableContainer>

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
    </div>
  );
};

export default UserManage;
