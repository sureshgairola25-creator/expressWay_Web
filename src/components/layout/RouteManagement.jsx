import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Autocomplete,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import axios from '../../api/apiClient';
import PageContainer from './PageContainer';

export default function RouteManagement() {
  const [startLocations, setStartLocations] = useState([]);
  const [endLocations, setEndLocations] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [dropPoints, setDropPoints] = useState([]);

  const [selectedStartLocation, setSelectedStartLocation] = useState(null);
  const [selectedEndLocation, setSelectedEndLocation] = useState(null);

  const [newLocation, setNewLocation] = useState('');
  const [newPickupPoint, setNewPickupPoint] = useState('');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [endLocationModalOpen, setEndLocationModalOpen] = useState(false);
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [newDropPoint, setNewDropPoint] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchLocations();

  }, []);

  // Fetch existing locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
  
      // Step 1: Fetch start locations
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
      console.error("Fetch error:", err);
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };
  
  

  // Fetch pickup points (filtered by start location if selected)
  const fetchPickupPoints = async (location) => {
    try {
      const url = `locations/start/${location.id}/pickup`;      
      const response = await axios.get(url);
      setPickupPoints(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch drop points (filtered by end location if selected)
  const fetchDropPoints = async (location) => {
    try {
      const url = `locations/end/${location.id}/drop`
      const response = await axios.get(url);
      setDropPoints(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add new end location with start location requirement
  const addEndLocation = async () => {
    if (!newLocation.trim() || !selectedStartLocation) {
      setError('Please select a Start Location and enter an End Location name');
      return;
    }

    try {
      setLoading(true);
      await axios.post('locations/end', {
        name: newLocation,
        startLocationId: selectedStartLocation.id
      });

      setNewLocation('');
      setSelectedStartLocation(null);
      setEndLocationModalOpen(false);
      await fetchLocations();
      setSuccess('End location added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add end location');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add pickup point
  const addPickupPoint = async () => {
    if (!newPickupPoint.trim() || !selectedStartLocation) return;

    try {
      setLoading(true);
      await axios.post('locations/pickup', {
        name: newPickupPoint,
        startLocationId: selectedStartLocation.id
      });

      setNewPickupPoint('');
      setPickupModalOpen(false);
      console.log("Selected Start Location:", selectedStartLocation);
      await fetchPickupPoints(selectedStartLocation);
      setSuccess('Pickup point added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add pickup point');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add drop point
  const addDropPoint = async () => {
    if (!newDropPoint.trim() || !selectedEndLocation) return;

    try {
      setLoading(true);
      await axios.post('locations/drop', {
        name: newDropPoint,
        endLocationId: selectedEndLocation.id
      });

      setNewDropPoint('');
      setDropModalOpen(false);
      await fetchDropPoints();
      setSuccess('Drop point added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add drop point');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (type, id) => {
    try {
      setLoading(true);
      let endpoint = '';

      // Determine the correct API endpoint based on type
      switch (type) {
        case 'start-locations':
          endpoint = `/locations/start/${id}`;
          break;
        case 'end-locations':
          endpoint = `/locations/end/${id}`;
          break;
        case 'pickup-points':
          endpoint = `/locations/pickup/${id}`;
          break;
        case 'drop-points':
          endpoint = `/locations/drop/${id}`;
          break;
        default:
          throw new Error('Invalid delete type');
      }

      await axios.delete(endpoint);

      // Refresh data
      await fetchLocations();
      await fetchPickupPoints(selectedStartLocation);
      await fetchDropPoints(selectedEndLocation);

      setSuccess(`${type.replace('-', ' ')} deleted successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle start location selection
  const handleStartLocationChange = (event, value) => {
    setSelectedStartLocation(value);
    // Refetch pickup points when start location changes
    if (value) {
      fetchPickupPoints(value);
    } else {
      setPickupPoints([]);
    }
  };

  // Handle edit item
  const handleEdit = (item) => {
    setEditingItem(item);
    setEditModalOpen(true);
  };

  // Edit item
  const editItem = async () => {
    if (!editingItem || !editingItem.name) return;

    try {
      setLoading(true);
      let endpoint = '';
console.log("Editing Item:", editingItem);

      // Determine the correct API endpoint based on item type
      switch (editingItem.type ) {
        case 'start-locations':
          endpoint = `/locations/start/${editingItem.id}`;
          break;
        case 'end-locations':
          endpoint = `/locations/end/${editingItem.id}`;
          break;
        case 'pickup-points':
          endpoint = `/locations/pickup-points/${editingItem.id}`;
          break;
        case 'drop-points':
          endpoint = `/locations/drop-points/${editingItem.id}`;
          break;
        default:
          throw new Error('Invalid item type for edit');
      }

      await axios.put(endpoint, { name: editingItem.name });

      // Refresh data
      await fetchLocations();
      await fetchPickupPoints(selectedStartLocation);
      await fetchDropPoints(selectedEndLocation);

      setEditModalOpen(false);
      setEditingItem(null);
      setSuccess(`${editingItem.type || 'item'} updated successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleEndLocationChange = (event, value) => {
    setSelectedEndLocation(value);
    // Refetch drop points when end location changes
    if (value) {
      fetchDropPoints(value);
    } else {
      setDropPoints([]);
    }
  };

  return (
    <PageContainer>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}>
          Route Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Manage start locations, pickup points, end locations, and drop points for your routes.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3} className="flexColumn">
        {/* Start Location Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ color: '#7c3aed', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Start Location
                </Typography>
              </Box>

              <Autocomplete
                value={selectedStartLocation}
                onChange={handleStartLocationChange}
                options={startLocations}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select or add start location"
                    variant="outlined"
                    fullWidth
                  />
                )}
                sx={{ mb: 2 }}
              />

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setLocationModalOpen(true)}
                sx={{
                  color: '#7c3aed',
                  borderColor: '#7c3aed',
                  '&:hover': {
                    backgroundColor: '#f3e8ff',
                    borderColor: '#7c3aed',
                  },
                }}
              >
                Add New Start Location
              </Button>

              {/* Start Locations Table */}
              {startLocations.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Existing Start Locations
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {startLocations.map((location) => (
                          <TableRow key={location.id}>
                            <TableCell>{location.name}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit({ ...location, type: 'start-locations' })}
                                    sx={{ color: '#1976d2' }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteItem('start-locations', location.id)}
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
                </Box>
              )}

              {/* Pickup Points Section */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PlaceIcon sx={{ color: '#7c3aed', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pickup Points
                  </Typography>
                </Box>

                {selectedStartLocation && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setPickupModalOpen(true)}
                      sx={{
                        backgroundColor: '#7c3aed',
                        '&:hover': { backgroundColor: '#6b2fbc' },
                        mb: 2,
                      }}
                    >
                      Add Pickup Point
                    </Button>

                    {pickupPoints.length > 0 && (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pickupPoints.map((point) => (
                              <TableRow key={point.id}>
                                <TableCell>{point.name}</TableCell>
                                <TableCell align="right">
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        size="small"
                                        onClick={() =>  handleEdit({ ...point, type: 'pickup-points' })}
                                        sx={{ color: '#1976d2' }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        size="small"
                                        onClick={() => deleteItem('pickup-points', point.id)}
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
                    )}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* End Location Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ color: '#7c3aed', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  End Location
                </Typography>
              </Box>

              <Autocomplete
                value={selectedEndLocation}
                onChange={handleEndLocationChange}
                options={endLocations}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select or add end location"
                    variant="outlined"
                    fullWidth
                  />
                )}
                sx={{ mb: 2 }}
              />

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setEndLocationModalOpen(true)}
                sx={{
                  color: '#7c3aed',
                  borderColor: '#7c3aed',
                  '&:hover': {
                    backgroundColor: '#f3e8ff',
                    borderColor: '#7c3aed',
                  },
                }}
              >
                Add New End Location
              </Button>

              {/* End Locations Table */}
              {endLocations.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Existing End Locations
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {endLocations.map((location) => (
                          <TableRow key={location.id}>
                            <TableCell>{location.name}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() =>handleEdit({ ...location, type: 'end-locations' })}
                                    sx={{ color: '#1976d2' }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteItem('end-locations', location.id)}
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
                </Box>
              )}

              {/* Drop Points Section */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PlaceIcon sx={{ color: '#7c3aed', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Drop Points
                  </Typography>
                </Box>

                {selectedEndLocation && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setDropModalOpen(true)}
                      sx={{
                        backgroundColor: '#7c3aed',
                        '&:hover': { backgroundColor: '#6b2fbc' },
                        mb: 2,
                      }}
                    >
                      Add Drop Point
                    </Button>

                    {dropPoints.length > 0 && (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dropPoints.map((point) => (
                              <TableRow key={point.id}>
                                <TableCell>{point.name}</TableCell>
                                <TableCell align="right">
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleEdit({ ...point, type: 'drop-points' })}
                                        sx={{ color: '#1976d2' }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        size="small"
                                        onClick={() => deleteItem('drop-points', point.id)}
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
                    )}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modals for adding new items */}
      {/* Start Location Modal */}
      <Dialog open={locationModalOpen} onClose={() => setLocationModalOpen(false)}>
        <DialogTitle>Add New Start Location</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Start Location Name *"
            fullWidth
            variant="outlined"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            error={!newLocation.trim()}
            helperText={!newLocation.trim() ? 'Start Location name is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationModalOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!newLocation.trim()) return;
              try {
                setLoading(true);
                await axios.post('locations/start', { name: newLocation });
                setNewLocation('');
                setLocationModalOpen(false);
                await fetchLocations();
                setSuccess('Start location added successfully');
                setTimeout(() => setSuccess(''), 3000);
              } catch (err) {
                setError('Failed to add start location');
                console.error(err);
              } finally {
                setLoading(false);
              }
            }}
            variant="contained"
            disabled={!newLocation.trim() || loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Start Location'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* End Location Modal */}
      <Dialog open={endLocationModalOpen} onClose={() => setEndLocationModalOpen(false)}>
        <DialogTitle>Add New End Location</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#6b7280' }}>
            Please select a Start Location before creating an End Location.
          </Typography>
          <Autocomplete
            value={selectedStartLocation}
            onChange={(event, value) => setSelectedStartLocation(value)}
            options={startLocations}
            getOptionLabel={(option) => option.name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Start Location *"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                error={!selectedStartLocation}
                helperText={!selectedStartLocation ? 'Start Location is required' : ''}
              />
            )}
          />
          <TextField
            autoFocus
            margin="dense"
            label="End Location Name *"
            fullWidth
            variant="outlined"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            error={!newLocation.trim()}
            helperText={!newLocation.trim() ? 'End Location name is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndLocationModalOpen(false)}>Cancel</Button>
          <Button
            onClick={addEndLocation}
            variant="contained"
            disabled={!newLocation.trim() || !selectedStartLocation || loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? <CircularProgress size={20} /> : 'Add End Location'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pickup Point Modal */}
      <Dialog open={pickupModalOpen} onClose={() => setPickupModalOpen(false)}>
        <DialogTitle>Add Pickup Point</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Pickup Point Name"
            fullWidth
            variant="outlined"
            value={newPickupPoint}
            onChange={(e) => setNewPickupPoint(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPickupModalOpen(false)}>Cancel</Button>
          <Button
            onClick={addPickupPoint}
            variant="contained"
            disabled={!newPickupPoint.trim() || !selectedStartLocation || loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Pickup Point'}
          </Button>
        </DialogActions>
      </Dialog>

            {/* Drop Point Modal */}
            <Dialog open={dropModalOpen} onClose={() => setDropModalOpen(false)}>
        <DialogTitle>Add Drop Point</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Drop Point Name"
            fullWidth
            variant="outlined"
            value={newDropPoint}
            onChange={(e) => setNewDropPoint(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDropModalOpen(false)}>Cancel</Button>
          <Button
            onClick={addDropPoint}
            variant="contained"
            disabled={!newDropPoint.trim() || !selectedEndLocation || loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Drop Point'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button
            onClick={editItem}
            variant="contained"
            disabled={!editingItem?.name?.trim() || loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}