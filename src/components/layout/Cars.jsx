import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from '../../api/apiClient';
import PageContainer from './PageContainer';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form states
  const [newCar, setNewCar] = useState({
    carName: '',
    registrationNumber: '',
    carUniqueNumber: '',
    class: 'standard', // Set default value
    carType: 'Sedan',
    totalSeats: '',
    status: true,
  });
  const [editingCar, setEditingCar] = useState(null);
  const [deletingCar, setDeletingCar] = useState(null);

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  // Fetch all cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('cars/list');
      setCars(response.data || []);
    } catch (err) { 
      setError('Failed to fetch cars');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle add car
  const handleAddCar = async () => {
    if (!newCar.carName || !newCar.registrationNumber || !newCar.carUniqueNumber || !newCar.class || !newCar.totalSeats) {
      setError('Please fill all required fields');
      return;
    }
    
    // Validate carUniqueNumber is unique
    const isUnique = !cars.some(car => car.carUniqueNumber === newCar.carUniqueNumber);
    if (!isUnique) {
      setError('Car Unique Number must be unique');
      return;
    }
    
    // Ensure carClass is properly set
    const carData = {
      ...newCar,
      class: newCar.class.toLowerCase() // Ensure lowercase for consistency
    };

    try {
      setLoading(true);
      await axios.post('cars/create', carData);

      // Reset form
      setNewCar({
        carName: '',
        registrationNumber: '',
        carType: 'Sedan',
        totalSeats: '',
        status: true,
      });
      setAddModalOpen(false);

      // Refresh list
      await fetchCars();

      setSuccess('Car added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add car');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit car
  const handleEdit = (car) => {
    setEditingCar(car);
    setEditModalOpen(true);
  };

  const editCar = async () => {
    if (!editingCar.carName || !editingCar.registrationNumber || !editingCar.carUniqueNumber || !editingCar.class || !editingCar.totalSeats) {
      setError('Please fill all required fields');
      return;
    }
    
    // Validate carUniqueNumber is unique (excluding the current car being edited)
    const isUnique = !cars.some(car => 
      car.carUniqueNumber === editingCar.carUniqueNumber && car.id !== editingCar.id
    );
    if (!isUnique) {
      setError('Car Unique Number must be unique');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`cars/update/${editingCar.id}`, editingCar);

      setEditModalOpen(false);
      setEditingCar(null);

      // Refresh list
      await fetchCars();

      setSuccess('Car updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update car');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete car
  const handleDelete = (car) => {
    setDeletingCar(car);
    setDeleteModalOpen(true);
  };

  const deleteCar = async () => {
    if (!deletingCar) return;

    try {
      setLoading(true);
      await axios.delete(`cars/delete/${deletingCar.id}`);

      // Remove from list
      setCars(prev => prev.filter(car => car.id !== deletingCar.id));

      setDeleteModalOpen(false);
      setDeletingCar(null);

      setSuccess('Car deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete car');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}>
          Car Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Manage your fleet of cars, including adding, editing, and removing vehicles.
        </Typography>
      </Box>

      {/* Add Car Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={{
            backgroundColor: '#7c3aed',
            '&:hover': { backgroundColor: '#6b2fbc' },
            borderRadius: '8px',
          }}
        >
          Add New Car
        </Button>
      </Box>

      {/* Cars Table */}
      <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Car Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Car Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Unique ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Seats</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                    <TableCell sx={{ color: '#6b7280' }}>{car.carName}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{car.registrationNumber}</TableCell>
                    <TableCell sx={{ color: '#6b7280', fontFamily: 'monospace' }}>{car.carUniqueNumber || 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{car.class || 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{car.carType}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{car.totalSeats}</TableCell>
                    {/* <TableCell>
                      <Typography
                        sx={{
                          color: car.status ? '#10b981' : '#ef4444',
                          fontWeight: 500,
                        }}
                      >
                        {car.status ? 'Active' : 'Inactive'}
                      </Typography>
                    </TableCell> */}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(car)}
                            sx={{ color: '#1976d2' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(car)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Seat Pricing Placeholder */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
              Seat Pricing Configuration
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              This section will allow configuring different seat types with varying prices (e.g., Window ₹599, Middle ₹499). Implementation pending after CRUD operations are finalized.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Add Car Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add New Car</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Car Name"
                value={newCar.carName}
                onChange={(e) => setNewCar({ ...newCar, carName: e.target.value })}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Car Number"
                value={newCar.registrationNumber}
                onChange={(e) => setNewCar({ ...newCar, registrationNumber: e.target.value })}
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Car Unique Number"
                value={newCar.carUniqueNumber}
                onChange={(e) => setNewCar({ ...newCar, carUniqueNumber: e.target.value })}
                fullWidth
                variant="outlined"
                required
                helperText="Must be unique across all cars"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '50%' }}>
              <FormControl fullWidth>
                <InputLabel>Class *</InputLabel>
                <Select
                  value={newCar.class || ''}
                  onChange={(e) => setNewCar({ ...newCar, class: e.target.value })}
                  label="Class"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  required
                >
                  {['standard', 'premium', 'classic', 'luxury', 'business'].map((carClass) => (
                    <MenuItem key={carClass} value={carClass}>
                      {carClass.charAt(0).toUpperCase() + carClass.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Car Type</InputLabel>
                <Select
                  value={newCar.carType}
                  onChange={(e) => setNewCar({ ...newCar, carType: e.target.value })}
                  label="Car Type"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="Sedan">Sedan</MenuItem>
                  <MenuItem value="SUV">SUV</MenuItem>
                  <MenuItem value="Hatchback">Hatchback</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total Seats"
                type="number"
                value={newCar.totalSeats}
                onChange={(e) => setNewCar({ ...newCar, totalSeats: e.target.value })}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newCar.status}
                    onChange={(e) => setNewCar({ ...newCar, status: e.target.checked })}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddCar}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? 'Adding...' : 'Add Car'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Car Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Car</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Car Name"
                value={editingCar?.carName || ''}
                onChange={(e) => setEditingCar({ ...editingCar, carName: e.target.value })}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Car Number"
                value={editingCar?.registrationNumber || ''}
                onChange={(e) => setEditingCar({ ...editingCar, registrationNumber: e.target.value })}
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Car Unique Number"
                value={editingCar?.carUniqueNumber || ''}
                onChange={(e) => setEditingCar({ ...editingCar, carUniqueNumber: e.target.value })}
                fullWidth
                variant="outlined"
                required
                helperText="Must be unique across all cars"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '50%' }}>
              <FormControl fullWidth>
                <InputLabel>Class *</InputLabel>
                <Select
                  value={editingCar?.class || ''}
                  onChange={(e) => setEditingCar({ ...editingCar, class: e.target.value })}
                  label="Class"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  required
                >
                  {['standard', 'premium', 'classic', 'luxury', 'business'].map((carClass) => (
                    <MenuItem key={carClass} value={carClass}>
                      {carClass.charAt(0).toUpperCase() + carClass.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ width: '50%' }}>
              <FormControl fullWidth>
                <InputLabel>Car Type</InputLabel>
                <Select
                  value={editingCar?.carType || 'Sedan'}
                  onChange={(e) => setEditingCar({ ...editingCar, carType: e.target.value })}
                  label="Car Type"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="Sedan">Sedan</MenuItem>
                  <MenuItem value="SUV">SUV</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total Seats"
                type="number"
                value={editingCar?.totalSeats || ''}
                onChange={(e) => setEditingCar({ ...editingCar, totalSeats: e.target.value })}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingCar?.status || false}
                    onChange={(e) => setEditingCar({ ...editingCar, status: e.target.checked })}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button
            onClick={editCar}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? 'Updating...' : 'Update Car'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Car Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete Car</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the car "{deletingCar?.carName}" ({deletingCar?.registrationNumber})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button
            onClick={deleteCar}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
