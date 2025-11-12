import React, { useEffect, useState } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button, 
  Alert, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  TablePagination,
  Chip
} from '@mui/material';
import { userService } from '../../apiServices/userService';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'mobile', label: 'Mobile', minWidth: 120 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'createdAt', label: 'Created At', minWidth: 150 },
  // { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' },
];

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getUsers();
        setUsers(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAdd = () => {
    console.log('Add new user');
    // Implement add logic here
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
    // Implement edit logic here
  };

  const handleDelete = (user) => {
    console.log('Delete user:', user);
    // Implement delete logic here
  };

  const handleView = (user) => {
    console.log('View user:', user);
    // Implement view logic here
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          User Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAdd}
        >
          Add New User
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                  <TableCell>{user.id || 'N/A'}</TableCell>
                  <TableCell>{user.firstName?user.firstName + ' ' + user.lastName : user.firstName || 'N/A'}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>{user.phoneNo || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role || 'User'} 
                      color={user.role === 'admin' ? 'secondary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isVerified ? 'Verified' : 'Inactive'} 
                      color={user.isVerified === true ? 'success' : 'default'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  {/* <TableCell align="center">
                    <IconButton onClick={() => handleView(user)} size="small" color="primary">
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(user)} size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user)} size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
