import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
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
  Autocomplete,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  EventSeat as SeatIcon,
} from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../api/apiClient';
import PageContainer from './PageContainer';

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [startLocations, setStartLocations] = useState([]);
  const [endLocations, setEndLocations] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [dropPoints, setDropPoints] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [seats, setSeats] = useState([]);
  const [meals, setMeals] = useState([{ type: 'Breakfast', price: '' }]);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form states
  const [newTrip, setNewTrip] = useState({
    startLocationId: '',
    endLocationId: '',
    pickupPoints: [],
    dropPoints: [],
    carId: '',
    departureTime: '',
    arrivalTime: '',
    status: 1,
  });
  const [editingTrip, setEditingTrip] = useState(null);
  const [deletingTrip, setDeletingTrip] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchTrips();
    fetchLocations();
    fetchCars();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get('trips/list');
      setTrips(response.data || []);
    } catch (err) {
      setError('Failed to fetch trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/locations/start');
      setStartLocations(res.data || []);
      // const res2 = await axios.get('/locations/end');
      // setEndLocations(res2.data || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get('cars/list');
      setCars(response.data || []);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
    }
  };

  const handleAddTrip = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Format the data for the API
      const tripData = {
        startLocationId: parseInt(newTrip.startLocationId),
        endLocationId: parseInt(newTrip.endLocationId),
        pickupPoints: newTrip.pickupPoints.map(id => parseInt(id)),
        dropPoints: newTrip.dropPoints.map(id => parseInt(id)),
        carId: parseInt(newTrip.carId),
        tripDate: newTrip.departureTime.split('T')[0],
        startTime: newTrip.departureTime.replace('T', ' '), // Format: '2025-10-26 10:27:00'
        endTime: newTrip.arrivalTime.replace('T', ' '),     // Format: '2025-10-26 23:29:00'
        status: newTrip.status,
        seats: seats.map(seat => ({
          seatNumber: seat.seatNumber,
          seatType: seat.seatType,
          price: parseFloat(seat.price) || 0
        })),
        meals: meals.map(meal => ({
          type: meal.type,
          price: parseFloat(meal.price) || 0
        }))
      };

      const response = await axios.post('trips/create', tripData);
      setSuccess('Trip added successfully!');
      setAddModalOpen(false);
      fetchTrips();
      resetForm();
      
      // Show success toast
      toast.success('Trip created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (err) {
      const errorMessage = err?.data?.message || 'Failed to add trip';
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      console.error('Error adding trip:', err);
    } finally {
      setLoading(false);
    }
  };
  function toLocalInputValue(dateString) {
    const d = new Date(dateString);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16);
  }
  

  const handleEdit = async (trip) => {
    try {
      console.log('Starting edit for trip:', trip);
      const response = await axios.get(`/trips/details/${trip.id}`);
      const tripData = response.data?.data || response.data; // Handle both response formats
      console.log('Trip data received:', tripData);
      
      // Extract start and end location from pickup and drop points
      const startLocation = tripData.pickupPoints?.[0]?.startLocation;
      const endLocation = tripData.dropPoints?.[0]?.endLocation;
      
      // Format the trip data for the form
      const formattedTrip = {
        ...tripData,
        id: tripData.id,
        startLocationId: startLocation?.id || '',
        endLocationId: endLocation?.id || '',
        pickupPoints: (tripData.pickupPoints || []).map(p => p.id || p), // Handle both object and ID
        dropPoints: (tripData.dropPoints || []).map(d => d.id || d),     // Handle both object and ID
        carId: tripData.carInfo?.id || tripData.carId || '',
        // departureTime: tripData.startTime ? new Date(tripData.startTime).toISOString().slice(0, 16) : '',
        // arrivalTime: tripData.endTime ? new Date(tripData.endTime).toISOString().slice(0, 16) : '',
        departureTime: tripData.startTime ? toLocalInputValue(tripData.startTime) : "",
        arrivalTime: tripData.endTime ? toLocalInputValue(tripData.endTime) : "",
        status: tripData.status ? 1 : 0, // Convert boolean to number
        availableSeats: tripData.availableSeats,
        seatsInfo: tripData.seatsInfo || [],
        meals: tripData.meals || []
      };

      console.log('Formatted trip data:', formattedTrip);
      
      setEditingTrip(formattedTrip);
      
      // If there's a car, set it as selected and initialize seats
      if (formattedTrip.carId) {
        const car = cars.find(c => c.id === formattedTrip.carId);
        if (car) {
          setSelectedCar(car);
          // If we have seat info, use it, otherwise generate default seats
          if (formattedTrip.seatsInfo && formattedTrip.seatsInfo.length > 0) {
            setSeats(formattedTrip.seatsInfo);
          } else {
            const totalSeats = car.totalSeats || 7;
            const defaultSeats = Array.from({ length: totalSeats }, (_, i) => ({
              seatNumber: `S${i + 1}`,
              seatType: 'middle',
              price: formattedTrip.pricePerSeat || 0
            }));
            setSeats(defaultSeats);
          }
        }
      } else {
        setSeats([]);
      }
      
      // Fetch related locations and points
      try {
        if (startLocation?.id) {
          console.log('Fetching locations for startLocation:', startLocation.id);
          const [locationsRes, pickupRes, endRes] = await Promise.all([
            axios.get('/locations/start'),
            axios.get(`/locations/start/${startLocation.id}/pickup`),
            axios.get(`/locations/start/${startLocation.id}/end`)
          ]);
          
          setStartLocations(locationsRes.data || []);
          setPickupPoints(pickupRes.data || []);
          setEndLocations(endRes.data || []);
          
          if (endLocation?.id) {
            console.log('Fetching drop points for endLocation:', endLocation.id);
            const dropRes = await axios.get(`/locations/end/${endLocation.id}/drop`);
            setDropPoints(dropRes.data || []);
          } else {
            setDropPoints([]);
          }
        } else {
          // If no start location, clear dependent data
          setStartLocations([]);
          setPickupPoints([]);
          setEndLocations([]);
          setDropPoints([]);
        }
      } catch (fetchError) {
        console.error('Error fetching location data:', fetchError);
        // Don't block the modal from opening if there's an error fetching locations
      }
      
      console.log('Opening edit modal...');
      setEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching trip details:', error);
      toast.error(error.response?.data?.message || 'Failed to load trip details');
    }
  };

  const handleDelete = (trip) => {
    setDeletingTrip(trip);
    setDeleteModalOpen(true);
  };

  const handleUpdateTrip = async () => {
    if (!editingTrip) return;
    
    try {
      setLoading(true);
      
      // Prepare the payload with the correct structure
      const payload = {
        startLocationId: editingTrip.startLocationId,
        endLocationId: editingTrip.endLocationId,
        pickupPoints: Array.isArray(editingTrip.pickupPoints) 
          ? editingTrip.pickupPoints 
          : [],
        dropPoints: Array.isArray(editingTrip.dropPoints) 
          ? editingTrip.dropPoints 
          : [],
        carId: editingTrip.carId,
        // departureTime: editingTrip.departureTime,
        // arrivalTime: editingTrip.arrivalTime,
        startTime: editingTrip.departureTime.replace('T', ' '), // Format: '2025-10-26 10:27:00'
        endTime: editingTrip.arrivalTime.replace('T', ' '),     // Format: '2025-10-26 23:29:00'
        status: editingTrip.status,
        seatsInfo: seats.map(seat => ({
          id: seat.id || undefined, // Only include ID if it exists
          seatNumber: seat.seatNumber,
          seatType: seat.seatType,
          price: parseFloat(seat.price) || 0
        })),
        meals: editingTrip.meals?.map(meal => ({
          id: meal.id || undefined, // Only include ID if it exists
          type: meal.type,
          price: parseFloat(meal.price) || 0
        })) || []
      };

      const response = await axios.put(`/trips/update/${editingTrip.id}`, payload);
      
      if (response.success) {
        toast.success('Trip updated successfully');
        fetchTrips();
        setEditModalOpen(false);
        setEditingTrip(null);
        setSelectedCar(null);
      } else {
        throw new Error(response.message || 'Failed to update trip');
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error(error.message || 'Failed to update trip');
    }
  };

  const deleteTrip = async () => {
    if (!deletingTrip) return;

    try {
      setLoading(true);
      await axios.delete(`trips/delete/${deletingTrip.id}`);
      setTrips(prev => prev.filter(trip => trip.id !== deletingTrip.id));
      setDeleteModalOpen(false);
      setDeletingTrip(null);
      toast.success('Trip deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete trip');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = () => {
    setMeals([...meals, { type: 'Breakfast', price: '' }]);
  };

  const removeMeal = (index) => {
    const updatedMeals = [...meals];
    updatedMeals.splice(index, 1);
    setMeals(updatedMeals);
  };

  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: field === 'price' ? value : value
    };
    setMeals(updatedMeals);
  };

  const handleStartLocationChange = async (event, value) => {
    const startLocationId = value?.id || '';
    setNewTrip(prev => ({
      ...prev,
      startLocationId,
      pickupPoints: [],
      endLocationId: '',
      dropPoints: []
    }));
  
    if (!startLocationId) {
      setPickupPoints([]);
      setEndLocations([]);
      setDropPoints([]);
      return;
    }
  
    try {
      // Fetch pickup points
      const pickupRes = await axios.get(`/locations/start/${startLocationId}/pickup`);
      setPickupPoints(pickupRes.data || []);
  
      // Fetch end locations
      const endRes = await axios.get(`/locations/start/${startLocationId}/end`);
      setEndLocations(endRes.data || []);
  
      // Clear drop points until end location is selected
      setDropPoints([]);
    } catch (err) {
      console.error('Failed to fetch pickup/end locations:', err);
    }
  };
  
  const handleEndLocationChange = async (event, value) => {
    const endLocationId = value?.id || '';
    setNewTrip(prev => ({
      ...prev,
      endLocationId,
      dropPoints: []
    }));
  
    if (!endLocationId) {
      setDropPoints([]);
      return;
    }
  
    try {
      const dropRes = await axios.get(`/locations/end/${endLocationId}/drop`);
      setDropPoints(dropRes.data || []);
    } catch (err) {
      console.error('Failed to fetch drop points:', err);
    }
  };

  const handlePickupPointsChange = (event, values) => {
    setNewTrip(prev => ({
      ...prev,
      pickupPoints: values.map(v => v.id)
    }));
  };

  const handleDropPointsChange = (event, values) => {
    setNewTrip(prev => ({
      ...prev,
      dropPoints: values.map(v => v.id)
    }));
  };
  
  
  

  const validateForm = () => {
    // Clear previous errors
    setError('');

    // Validate trip info
    if (!newTrip.startLocationId || !newTrip.endLocationId || !newTrip.carId || 
        !newTrip.departureTime || !newTrip.arrivalTime) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return false;
    }

    // Validate pickup and drop points
    if (newTrip.pickupPoints.length === 0 || newTrip.dropPoints.length === 0) {
      setError('Please select at least one pickup and drop point');
      toast.error('Please select at least one pickup and drop point', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return false;
    }

    // Validate departure and arrival times
    const departureDate = new Date(newTrip.departureTime);
    const arrivalDate = new Date(newTrip.arrivalTime);
    
    if (departureDate >= arrivalDate) {
      setError('Arrival time must be after departure time');
      toast.error('Arrival time must be after departure time', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return false;
    }

    // Validate seats
    if (seats.length === 0) {
      setError('Please configure at least one seat');
      toast.error('Please configure at least one seat', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return false;
    }

    // Validate seat prices
    for (const seat of seats) {
      if (isNaN(parseFloat(seat.price)) || parseFloat(seat.price) <= 0) {
        setError('Please enter valid seat prices');
        toast.error('Please enter valid seat prices', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        return false;
      }
    }

    // Validate meals
    for (const meal of meals) {
      if (!meal.type || !meal.price) {
        setError('Please fill in all meal details');
        toast.error('Please fill in all meal details', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        return false;
      }
      if (isNaN(parseFloat(meal.price)) || parseFloat(meal.price) < 0) {
        setError('Please enter valid meal prices');
        toast.error('Please enter valid meal prices', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    setNewTrip({
      startLocationId: '',
      endLocationId: '',
      pickupPoints: [],
      dropPoints: [],
      carId: '',
      departureTime: '',
      arrivalTime: '',
      status: 1,
    });
    setSeats([]);
    setMeals([{ type: 'Breakfast', price: '' }]);
    setPickupPoints([]);
    setDropPoints([]);
    setSelectedCar(null);
  };

  return (
    <PageContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}>
          Trip Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Manage your trips, including routes, schedules, and pricing.
        </Typography>
      </Box>

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
          Add New Trip
        </Button>
      </Box>

      <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Start Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>PickupPoints</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>End Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>DropPoints</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Car</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Departure</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Arrival</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Available Seats</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created At</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                    <TableCell sx={{ color: '#6b7280' }}>{trip.pickupPoints[0].startLocation.name || 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{trip.pickupPoints?.map(p => p.name).join(', ') || 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{trip.dropPoints[0].endLocation.name || 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{trip.dropPoints?.map(d => d.name).join(', ') || 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{trip.carInfo?.carName || 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{new Date(trip.startTime).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{new Date(trip.endTime).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{trip.availableSeats}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: trip.status === true ? '#10b981' : '#ef4444',
                          fontWeight: 500,
                        }}
                      >
                        {trip.status === true ? 'Active' : 'Inactive'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{new Date(trip.created_at).toLocaleString() || 'N/A'}</TableCell>
                          <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(trip)} sx={{ color: '#1976d2' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(trip)} sx={{ color: '#f44336' }}>
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

      {/* Add Trip Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Trip</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              {/* Row 1 */}
              <Grid item xs={12} md={12} sx={{ width:'100%'}}>
                <Autocomplete
                  value={startLocations.find(loc => loc.id === newTrip.startLocationId) || null}
                  onChange={handleStartLocationChange}
                  options={startLocations}
                  getOptionLabel={(option) => option.name || ''}
                  renderInput={(params) => <TextField {...params} label="Start Location" fullWidth />}
                />
              </Grid>

              <Grid item xs={12} md={12} sx={{ width: '100%' }}>
                <Autocomplete
                  multiple
                  value={pickupPoints.filter(p => newTrip.pickupPoints.includes(p.id))}
                  onChange={handlePickupPointsChange}
                  options={pickupPoints}
                  getOptionLabel={(option) => option.name || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Pickup Points"
                      placeholder="Select pickup points"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ width: '100%' }}>
                <Autocomplete
                  value={endLocations.find(loc => loc.id === newTrip.endLocationId) || null}
                  onChange={handleEndLocationChange}
                  options={endLocations}
                  getOptionLabel={(option) => option.name || ''}
                  renderInput={(params) => <TextField {...params} label="End Location" fullWidth />}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              {/* Row 2 */}
              <Grid item xs={12} md={12} sx={{ width: '100%' }}>
                <Autocomplete
                  multiple
                  value={dropPoints.filter(d => newTrip.dropPoints.includes(d.id))}
                  onChange={handleDropPointsChange}
                  options={dropPoints}
                  getOptionLabel={(option) => option.name || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Drop Points"
                      placeholder="Select drop points"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={!newTrip.endLocationId}
                />
              </Grid>

              <Grid item xs={12} md={12} sx={{ width:250}}>
                <Autocomplete
                  value={cars.find(car => car.id === newTrip.carId) || null}
                  onChange={async (event, value) => {
                    setNewTrip({ ...newTrip, carId: value?.id || '' });
                    if (value) {
                      setSelectedCar(value);
                      // Generate seats based on car capacity
                      const totalSeats = value.totalSeats || 7; // Default to 7 if not provided
                      const newSeats = Array.from({ length: totalSeats }, (_, i) => ({
                        seatNumber: `S${i + 1}`,
                        seatType: 'middle',
                        price: newTrip.pricePerSeat || 0
                      }));
                      setSeats(newSeats);
                    } else {
                      setSelectedCar(null);
                      setSeats([]);
                    }
                  }}
                  options={cars}
                  getOptionLabel={(option) => `${option.carName} (${option.registrationNumber} - ${option.totalSeats || 7} seats)`}
                  renderInput={(params) => <TextField {...params} label="Car" fullWidth />}
                />   
              </Grid>

              <Grid item xs={12} md={12} sx={{ width:250}}>
                <TextField
                  label="Departure Time"
                  type="datetime-local"
                  value={newTrip.departureTime}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, departureTime: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            {/* Seat Configuration */}
            {selectedCar && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Seat Configuration
                </Typography>
                <Grid container spacing={3} sx={{ mb: 2 }}>
                  {seats.map((seat, index) => (
                    <React.Fragment key={seat.seatNumber}>
                      <Grid item xs={12} sm={6} md={12} sx={{ width:250}}>
                        <TextField
                          label="Seat Number"
                          value={seat.seatNumber}
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={12} sx={{ width:250}}>
                        <FormControl fullWidth>
                          <InputLabel>Seat Type</InputLabel>
                          <Select
                            value={seat.seatType}
                            onChange={(e) => {
                              const newSeats = [...seats];
                              newSeats[index].seatType = e.target.value;
                              setSeats(newSeats);
                            }}
                            label="Seat Type"
                          >
                            <MenuItem value="window">Window</MenuItem>
                            <MenuItem value="middle">Middle</MenuItem>
                            <MenuItem value="aisle">Aisle</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={12} sx={{ width:250}}>
                        <TextField
                          label="Price"
                          type="number"
                          value={seat.price}
                          onChange={(e) => {
                            const newSeats = [...seats];
                            newSeats[index].price = e.target.value;
                            setSeats(newSeats);
                          }}
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          }}
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
            )}
            <Grid container spacing={3} sx={{ mb: 2 }}>
              {/* Row 3 */}
              <Grid item xs={12} md={12} sx={{ width:250}}>
                <TextField
                  label="Arrival Time"
                  type="datetime-local"
                  value={newTrip.arrivalTime}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, arrivalTime: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


              {/* Row 4 */}
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newTrip.status}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, status: e.target.value })
                    }
                    label="Status"
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Meals Section */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Meals
              </Typography>
              {meals.map((meal, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                  <Grid item xs={12} sm={5} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Meal Type</InputLabel>
                      <Select
                        value={meal.type}
                        onChange={(e) => handleMealChange(index, 'type', e.target.value)}
                        label="Meal Type"
                      >
                        <MenuItem value="Breakfast">Breakfast</MenuItem>
                        <MenuItem value="Lunch">Lunch</MenuItem>
                        <MenuItem value="Dinner">Dinner</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={5} md={3}>
                    <TextField
                      label="Price"
                      type="number"
                      value={meal.price}
                      onChange={(e) => handleMealChange(index, 'price', e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={1}>
                    <IconButton 
                      onClick={() => removeMeal(index)}
                      color="error"
                      disabled={meals.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={addMeal}
                sx={{ mt: 1 }}
              >
                Add Meal
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddTrip}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? 'Adding...' : 'Add Trip'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Trip Modal */}
      <Dialog 
        open={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setEditingTrip(null);
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Edit Trip</DialogTitle>
        <DialogContent>
          {editingTrip ? (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3} sx={{ mb: 2 }}>
                {/* Row 1 - Start Location and Pickup Points */}
                <Grid item xs={12} md={12} sx={{ width:'100%'}}>
                  <Autocomplete
                    value={startLocations.find(loc => loc.id === editingTrip.startLocationId) || null}
                    onChange={async (event, value) => {
                      const startLocationId = value?.id || '';
                      setEditingTrip(prev => ({
                        ...prev,
                        startLocationId,
                        endLocationId: '',
                        pickupPoints: [],
                        dropPoints: []
                      }));
                      
                      if (startLocationId) {
                        try {
                          const [pickupRes, endRes] = await Promise.all([
                            axios.get(`/locations/start/${startLocationId}/pickup`),
                            axios.get(`/locations/start/${startLocationId}/end`)
                          ]);
                          setPickupPoints(pickupRes.data || []);
                          setEndLocations(endRes.data || []);
                        } catch (err) {
                          console.error('Error fetching location data:', err);
                        }
                      } else {
                        setPickupPoints([]);
                        setEndLocations([]);
                        setDropPoints([]);
                      }
                    }}
                    options={startLocations}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => (
                      <TextField {...params} label="Start Location" fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={12} sx={{ width:'100%'}}>
                  <Autocomplete
                    multiple
                    value={pickupPoints.filter(p => editingTrip.pickupPoints.includes(p.id))}
                    onChange={(event, values) => {
                      setEditingTrip(prev => ({
                        ...prev,
                        pickupPoints: values.map(v => v.id)
                      }));
                    }}
                    options={pickupPoints}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Pickup Points"
                        placeholder="Select pickup points"
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    disabled={!editingTrip.startLocationId}
                  />
                </Grid>

                <Grid item xs={12} md={12} sx={{ width:'100%'}}>
                  <Autocomplete
                    value={endLocations.find(loc => loc.id === editingTrip.endLocationId) || null}
                    onChange={async (event, value) => {
                      const endLocationId = value?.id || '';
                      setEditingTrip(prev => ({
                        ...prev,
                        endLocationId,
                        dropPoints: []
                      }));
                      
                      if (endLocationId) {
                        try {
                          const dropRes = await axios.get(`/locations/end/${endLocationId}/drop`);
                          setDropPoints(dropRes.data || []);
                        } catch (err) {
                          console.error('Error fetching drop points:', err);
                        }
                      } else {
                        setDropPoints([]);
                      }
                    }}
                    options={endLocations}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => (
                      <TextField {...params} label="End Location" fullWidth />
                    )}
                    disabled={!editingTrip.startLocationId}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 2 }} >
                {/* Row 2 - Drop Points, Car, and Departure Time */}
                <Grid item xs={12} md={12} sx={{ width: '100%' }}>
                  <Autocomplete
                    multiple
                    value={dropPoints.filter(d => editingTrip.dropPoints.includes(d.id))}
                    onChange={(event, values) => {
                      setEditingTrip(prev => ({
                        ...prev,
                        dropPoints: values.map(v => v.id)
                      }));
                    }}
                    options={dropPoints}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Drop Points"
                        placeholder="Select drop points"
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    disabled={!editingTrip.endLocationId}
                  />
                </Grid>

                <Grid item xs={12} md={12} sx={{ width: 250 }}>
                  <Autocomplete
                    value={cars.find(car => car.id === editingTrip.carId) || null}
                    onChange={async (event, value) => {
                      const updatedTrip = {
                        ...editingTrip,
                        carId: value?.id || ''
                      };
                      
                      setEditingTrip(updatedTrip);
                      setSelectedCar(value || null);
                      
                      if (value) {
                        // If we have existing seats and the car capacity hasn't changed, keep them
                        if (editingTrip.seatsInfo && editingTrip.seatsInfo.length === value.totalSeats) {
                          setSeats([...editingTrip.seatsInfo]);
                        } else {
                          // Otherwise generate new seats based on car capacity
                          const totalSeats = value.totalSeats || 7;
                          const newSeats = Array.from({ length: totalSeats }, (_, i) => {
                            // Try to find existing seat data for this position
                            const existingSeat = editingTrip.seatsInfo?.[i] || {};
                            return {
                              seatNumber: `S${i + 1}`,
                              seatType: existingSeat.seatType || 'middle',
                              price: existingSeat.price || editingTrip.pricePerSeat || 0,
                              id: existingSeat.id || null
                            };
                          });
                          setSeats(newSeats);
                        }
                      } else {
                        setSelectedCar(null);
                        setSeats([]);
                      }
                    }}
                    options={cars}
                    getOptionLabel={(option) => 
                      option ? `${option.carName} (${option.registrationNumber} - ${option.totalSeats || 7} seats)` : ''
                    }
                    renderInput={(params) => <TextField {...params} label="Car" fullWidth />}
                  />
                </Grid>

                <Grid item xs={12} md={12} sx={{ width: 250 }}>
                  <TextField
                    label="Departure Time"
                    type="datetime-local"
                    value={editingTrip.departureTime || ''}
                    onChange={(e) =>
                      setEditingTrip(prev => ({
                        ...prev,
                        departureTime: e.target.value
                      }))
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              {/* Seat Configuration */}
              {selectedCar && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Seat Configuration
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 2 }}>
                    {seats.map((seat, index) => (
                      <React.Fragment key={seat.seatNumber}>
                        <Grid item xs={12} sm={6} md={12} sx={{ width: 250 }}>
                          <TextField
                            label="Seat Number"
                            value={seat.seatNumber}
                            fullWidth
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={12} sx={{ width: 250 }}>
                          <FormControl fullWidth>
                            <InputLabel>Seat Type</InputLabel>
                            <Select
                              value={seat.seatType}
                              onChange={(e) => {
                                const newSeats = [...seats];
                                newSeats[index].seatType = e.target.value;
                                setSeats(newSeats);
                              }}
                              label="Seat Type"
                            >
                              <MenuItem value="window">Window</MenuItem>
                              <MenuItem value="middle">Middle</MenuItem>
                              <MenuItem value="aisle">Aisle</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={12} sx={{ width: 250 }}>
                          <TextField
                            label="Price"
                            type="number"
                            value={seat.price}
                            onChange={(e) => {
                              const newSeats = [...seats];
                              newSeats[index].price = e.target.value;
                              setSeats(newSeats);
                            }}
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                          />
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={3} sx={{ mb: 2 }}>
                {/* Row 3 - Arrival Time and Status */}
                <Grid item xs={12} md={12} sx={{ width: 250 }}>
                  <TextField
                    label="Arrival Time"
                    type="datetime-local"
                    value={editingTrip.arrivalTime || ''}
                    onChange={(e) =>
                      setEditingTrip(prev => ({
                        ...prev,
                        arrivalTime: e.target.value
                      }))
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editingTrip.status ?? 1}
                      onChange={(e) =>
                        setEditingTrip(prev => ({
                          ...prev,
                          status: e.target.value
                        }))
                      }
                      label="Status"
                    >
                      <MenuItem value={1}>Active</MenuItem>
                      <MenuItem value={0}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Meals Section */}
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Meals
                </Typography>
                {editingTrip.meals?.map((meal, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                    <Grid item xs={12} sm={5} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Meal Type</InputLabel>
                        <Select
                          value={meal.type}
                          onChange={(e) => {
                            const updatedMeals = [...editingTrip.meals];
                            updatedMeals[index].type = e.target.value;
                            setEditingTrip(prev => ({
                              ...prev,
                              meals: updatedMeals
                            }));
                          }}
                          label="Meal Type"
                        >
                          <MenuItem value="Breakfast">Breakfast</MenuItem>
                          <MenuItem value="Lunch">Lunch</MenuItem>
                          <MenuItem value="Dinner">Dinner</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5} md={3}>
                      <TextField
                        label="Price"
                        type="number"
                        value={meal.price}
                        onChange={(e) => {
                          const updatedMeals = [...editingTrip.meals];
                          updatedMeals[index].price = e.target.value;
                          setEditingTrip(prev => ({
                            ...prev,
                            meals: updatedMeals
                          }));
                        }}
                        fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={1}>
                      <IconButton 
                        onClick={() => {
                          const updatedMeals = [...editingTrip.meals];
                          updatedMeals.splice(index, 1);
                          setEditingTrip(prev => ({
                            ...prev,
                            meals: updatedMeals
                          }));
                        }}
                        color="error"
                        disabled={editingTrip.meals?.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={() => {
                    const updatedMeals = [...(editingTrip.meals || [])];
                    updatedMeals.push({ type: 'Breakfast', price: '' });
                    setEditingTrip(prev => ({
                      ...prev,
                      meals: updatedMeals
                    }));
                  }}
                  sx={{ mt: 1 }}
                >
                  Add Meal
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              {/* <CircularProgress /> */}
              <Typography>Loading trip details...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setEditModalOpen(false);
              setEditingTrip(null);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateTrip}
            variant="contained"
            disabled={!editingTrip || loading}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6b2fbc' } }}
          >
            {loading ? 'Updating...' : 'Update Trip'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Trip Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete Trip</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this trip? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button
            onClick={deleteTrip}
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
