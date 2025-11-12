import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from '../../api/apiClient';
import PageContainer from './PageContainer';

export default function RouteCreation() {
  const [startLocations, setStartLocations] = useState([]);
  const [endLocations, setEndLocations] = useState([]);
  const [existingRoutes, setExistingRoutes] = useState([]);
  const [selectedStartLocation, setSelectedStartLocation] = useState(null);
  const [selectedEndLocation, setSelectedEndLocation] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRoute, setDeletingRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchLocations();
    fetchExistingRoutes();
  }, []);

  // Fetch start and end locations
  const fetchLocations = async () => {
    try {
        const startRes = await axios.get('locations/start', {
            headers: { 'Cache-Control': 'no-cache' }
          });
          console.log("Start Locations Response:", startRes);
          setStartLocations(startRes.data || []);
      
          // Step 2: Fetch end locations (after start locations are done)
          const endRes = await axios.get('locations/end', {
            headers: { 'Cache-Control': 'no-cache' }
          });
          console.log("End Locations Response:", endRes);
          setEndLocations(endRes.data || []);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error(err);
    }
  };

  // Fetch existing routes
  const fetchExistingRoutes = async () => {
    try {
      const response = await axios.get('/locations/routes');
      // Handle API response structure: { success: true, data: [...] }
      setExistingRoutes(response.data || []);
    } catch (err) {
      console.error('Failed to fetch existing routes:', err);
    }
  };

  // Handle form submission
  const handleCreateRoute = async () => {
    if (!selectedStartLocation || !selectedEndLocation) {
      setError('Please select both start and end locations');
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      setError('');

      await axios.post('locations/route', {
        startLocationId: selectedStartLocation.id,
        endLocationId: selectedEndLocation.id
      });

      // Clear form
      setSelectedStartLocation(null);
      setSelectedEndLocation(null);

      // Refresh data
      await fetchExistingRoutes();

      // Show success message
      setSuccess('Route created successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to create route');
      setSnackbarOpen(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit route
  const handleEdit = (route) => {
    setEditingRoute(route);
    setEditModalOpen(true);
  };

  // Edit route
  const editRoute = async () => {
    if (!editingRoute) return;

    try {
      setLoading(true);
      await axios.put(`locations/route/${editingRoute.id}`, {
        startLocationId: editingRoute.StartLocation?.id,
        endLocationId: editingRoute.EndLocation?.id
      });

      // Refresh data
      await fetchExistingRoutes();

      setEditModalOpen(false);
      setEditingRoute(null);
      setSuccess('Route updated successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to update route');
      setSnackbarOpen(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete route
  const handleDelete = (route) => {
    setDeletingRoute(route);
    setDeleteModalOpen(true);
  };

  // Delete route
  const deleteRoute = async () => {
    if (!deletingRoute) return;

    try {
      setLoading(true);
      await axios.delete(`locations/route/${deletingRoute.id}`);

      // Remove from existingRoutes
      setExistingRoutes(prev => prev.filter(route => route.id !== deletingRoute.id));

      setDeleteModalOpen(false);
      setDeletingRoute(null);
      setSuccess('Route deleted successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to delete route');
      setSnackbarOpen(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}>
          Create Route
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Select start and end locations to create a new route.
        </Typography>
      </Box>

      <Grid container spacing={4} className="flexColumn">
        {/* Route Creation Form */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
                Route Details
              </Typography>

              <Grid container spacing={3} className="flexColumn">
                <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                  <Autocomplete
                    value={selectedStartLocation}
                    onChange={(event, value) => setSelectedStartLocation(value)}
                    options={startLocations}
                    getOptionLabel={(option) => option.name || ''}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Start Location"
                        variant="outlined"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                          '& .MuiInputBase-input': {
                            fontSize: '16px',
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                  <Autocomplete
                    value={selectedEndLocation}
                    onChange={(event, value) => setSelectedEndLocation(value)}
                    options={endLocations}
                    getOptionLabel={(option) => option.name || ''}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="End Location"
                        variant="outlined"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                          '& .MuiInputBase-input': {
                            fontSize: '16px',
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleCreateRoute}
                  disabled={!selectedStartLocation || !selectedEndLocation || loading}
                  sx={{
                    backgroundColor: '#7c3aed',
                    '&:hover': {
                      backgroundColor: '#6b2fbc',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
                    },
                    '&:disabled': {
                      backgroundColor: '#d1d5db',
                      color: '#9ca3af',
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Creating...' : 'Create Route'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Existing Routes Table */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              backgroundColor: '#ffffff',
              height: 'fit-content',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                Recent Routes
              </Typography>

              {existingRoutes.length > 0 ? (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Start</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>End</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {existingRoutes.slice(0, 5).map((route) => (
                        <TableRow key={route.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                          <TableCell sx={{ color: '#6b7280' }}>{route.StartLocation?.name || 'N/A'}</TableCell>
                          <TableCell sx={{ color: '#6b7280' }}>{route.EndLocation?.name || 'N/A'}</TableCell>
                          <TableCell sx={{ color: '#6b7280' }}>
                            {route.createdAt ? new Date(route.createdAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit Route">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(route)}
                                  sx={{ color: '#1976d2' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Route">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(route)}
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
              ) : (
                <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', py: 4 }}>
                  No routes created yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Route Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Route</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                value={editingRoute?.StartLocation || null}
                onChange={(event, value) => setEditingRoute(prev => ({ ...prev, StartLocation: value }))}
                options={startLocations}
                getOptionLabel={(option) => option?.name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Start Location"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '16px',
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                value={editingRoute?.EndLocation || null}
                onChange={(event, value) => setEditingRoute(prev => ({ ...prev, EndLocation: value }))}
                options={endLocations}
                getOptionLabel={(option) => option?.name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="End Location"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '16px',
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button
            onClick={editRoute}
            variant="contained"
            disabled={!editingRoute?.StartLocation || !editingRoute?.EndLocation || loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Route'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Route Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete Route</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the route from {deletingRoute?.StartLocation?.name} to {deletingRoute?.EndLocation?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button
            onClick={deleteRoute}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
