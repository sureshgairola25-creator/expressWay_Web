import React from 'react';
import { useEffect, useState } from 'react';

import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Divider,
    Button,
    ThemeProvider,
    createTheme,
    Chip,
} from '@mui/material';
import { 
    DriveEta, 
    CalendarToday, 
    AccessTime, 
    LocationOn, 
    ArrowForward,
    AttachMoney,
    CheckCircle,
    Cancel,
    MoreVert
} from '@mui/icons-material';
import Header from './layout/Header';
import Footer from './layout/Footer';
import config from "../config.js";
import { fetchUserRides } from '../apiServices/userInfo.js';
const BASE_URL = config.API_BASE_URL;


// --- Professional Theme Definition ---
const professionalTheme = createTheme({
    palette: {
        primary: {
            main: '#007bff', 
        },
        secondary: {
            main: '#6c757d',
        },
        success: {
            main: '#28a745',
        },
        error: {
            main: '#dc3545',
        },
        background: {
            default: '#f4f7f9',
            paper: '#ffffff',
        },
    },
    typography: {
        h5: {
            fontWeight: 600,
        },
        subtitle1: {
            fontWeight: 500,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Modern rounded corners
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Subtle, lifting shadow
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                }
            }
        },
    }
});


// --- Reusable Cab Card Component ---
const CabCard = ({ booking }) => {
    const { status, cabType, date, time, pickup, dropoff, fare } = booking;
    
    // Determine Chip color and icon based on status
    let statusColor = 'default';
    let statusIcon = <MoreVert />;
    if (status === 'Pending') {
        statusColor = 'warning';
        statusIcon = <Cancel />;
    } else if (status === 'Completed') {
        statusColor = 'secondary';
        statusIcon = <CheckCircle />;
    } else if (status === 'Cancelled') {
        statusColor = 'error';
        statusIcon = <Cancel />;
    }else if (status === 'Confirmed') {
        statusColor = 'success';
        statusIcon = <CheckCircle />;
    }

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderLeft: `5px solid ${professionalTheme.palette[statusColor].main}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" color="text.primary">
                    Booking ID: **#{booking.id}**
                </Typography>
                <Chip 
                    label={status} 
                    icon={statusIcon}
                    color={statusColor} 
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2} alignItems="center">
                {/* Cab & Time Details */}
                <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DriveEta color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.primary">
                            **{cabType}**
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday color="secondary" sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                            {date}
                        </Typography>
                        <AccessTime color="secondary" sx={{ ml: 2, mr: 1, fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                            {time}
                        </Typography>
                    </Box>
                </Grid>

                {/* Route Details */}
                <Grid item xs={12} sm={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn color="success" sx={{ mr: 1 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
                            {pickup}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <ArrowForward color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
                            {dropoff}
                        </Typography>
                    </Box>
                </Grid>

                {/* Price & Actions */}
                <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, mb: 1 }}>
                        {/* <AttachMoney color="action" sx={{ fontSize: 24 }} /> */}
                        <Typography variant="h6" color="primary">
                            **₹{fare.toFixed(2)}**
                        </Typography>
                    </Box>
                    
                    {status === 'Confirmed' ? (
                        <Button 
                            variant="outlined" 
                            color="error" 
                            size="small"
                            onClick={() => console.log('Cancel booking', booking.id)}
                        >
                            Cancel Ride
                        </Button>
                    ) : (
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            size="small"
                            onClick={() => console.log('View details', booking.id)}
                        >
                            View Details
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

// --- Main List Component ---
const BookedCabsList = () => {
    const [loading, setLoading] = useState(true);
const [bookings, setBookings] = useState([]);
const [error, setError] = useState('');

    // fetch rides
    useEffect(() => {
        const fetchRides = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const userId = JSON.parse(localStorage.getItem("userInfo")).id;
               const response = await fetchUserRides(userId);

                if (!response.success) {
                    throw new Error("Failed to fetch rides");
                }

                const data = response;
                setBookings(data.rides || []);
            } catch (err) {
                console.error("Error fetching rides:", err);
                setError("Failed to load ride history");
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);
    // In a real application, this data would come from a state management solution (e.g., Redux, Context) or a fetch request.
    const upcomingBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
    const pastBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');
    // const today = new Date();
    // const upcomingBookings = bookings.filter(b => b.journeyDate >= today);
    // const pastBookings = bookings.filter(b => b.journeyDate < today);



    return (
        <>
        <Header />
        <ThemeProvider theme={professionalTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom sx={{ mb: 4, color: professionalTheme.palette.primary.main }}>
                        My Trip
                    </Typography>

                    {/* Upcoming Bookings Section */}
                    <Typography variant="h5" sx={{ mb: 2, borderBottom: '2px solid #ddd', pb: 1 }}>
                        Upcoming Rides ({upcomingBookings.length})
                    </Typography>
                    {upcomingBookings.length > 0 ? (
                        upcomingBookings.map(booking => (
                            <CabCard key={booking.id} booking={booking} />
                        ))
                    ) : (
                        <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                No upcoming cab bookings found.
                            </Typography>
                            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => window.location.href = '/'}>
                                Book a Ride Now
                            </Button>
                        </Paper>
                    )}

                    <Divider sx={{ my: 5 }} />

                    {/* Past & Completed Bookings Section */}
                    <Typography variant="h5" sx={{ mb: 2, borderBottom: '2px solid #ddd', pb: 1 }}>
                        Past Rides ({pastBookings.length})
                    </Typography>
                    {pastBookings.length > 0 ? (
                        pastBookings.map(booking => (
                            <CabCard key={booking.id} booking={booking} />
                        ))
                    ) : (
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                No past ride history available.
                            </Typography>
                        </Paper>
                    )}

                </Container>
            </Box>
        </ThemeProvider>
        {/* <SubscribeBar/> */}
        <Footer />
        </>
    );
};

export default BookedCabsList;


// import React, { useEffect, useState } from 'react';
// import {
//     Container,
//     Typography,
//     Box,
//     Grid,
//     Paper,
//     Divider,
//     Button,
//     ThemeProvider,
//     createTheme,
//     Chip,
//     CircularProgress,
// } from '@mui/material';
// import { 
//     DriveEta, 
//     CalendarToday, 
//     AccessTime, 
//     LocationOn, 
//     ArrowForward,
//     AttachMoney,
//     CheckCircle,
//     Cancel,
//     MoreVert
// } from '@mui/icons-material';
// import Header from './layout/Header';
// import Footer from './layout/Footer';

// // ✅ THEME
// const professionalTheme = createTheme({
//     palette: {
//         primary: { main: '#007bff' },
//         secondary: { main: '#6c757d' },
//         success: { main: '#28a745' },
//         error: { main: '#dc3545' },
//         background: { default: '#f4f7f9', paper: '#ffffff' },
//     },
//     typography: {
//         h5: { fontWeight: 600 },
//         subtitle1: { fontWeight: 500 },
//     },
// });

// // ✅ CAB CARD COMPONENT
// const CabCard = ({ booking, onCancel }) => {
//     const { id, status, cabType, date, time, pickup, dropoff, fare } = booking;

//     let statusColor = 'default';
//     let statusIcon = <MoreVert />;

//     if (status === 'Confirmed') { statusColor = 'success'; statusIcon = <CheckCircle />; }
//     else if (status === 'Completed') { statusColor = 'secondary'; statusIcon = <CheckCircle />; }
//     else if (status === 'Cancelled') { statusColor = 'error'; statusIcon = <Cancel />; }

//     return (
//         <Paper sx={{ p: 3, mb: 3, borderLeft: `5px solid ${professionalTheme.palette[statusColor].main}` }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//                 <Typography variant="subtitle1">Booking ID: #{id}</Typography>
//                 <Chip label={status} icon={statusIcon} color={statusColor} size="small" />
//             </Box>

//             <Divider sx={{ mb: 2 }} />

//             <Grid container spacing={2}>

//                 <Grid item xs={12} sm={4}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                         <DriveEta color="primary" sx={{ mr: 1 }} />
//                         <Typography variant="body2"><b>{cabType}</b></Typography>
//                     </Box>

//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <CalendarToday sx={{ mr: 1 }} color="secondary" />
//                         <Typography variant="body2">{date}</Typography>

//                         <AccessTime sx={{ ml: 2, mr: 1 }} color="secondary" />
//                         <Typography variant="body2">{time}</Typography>
//                     </Box>
//                 </Grid>

//                 <Grid item xs={12} sm={5}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <LocationOn color="success" sx={{ mr: 1 }} />
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>{pickup}</Typography>
//                     </Box>

//                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                         <ArrowForward color="primary" sx={{ mr: 1 }} />
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>{dropoff}</Typography>
//                     </Box>
//                 </Grid>

//                 <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
//                         <AttachMoney sx={{ mr: 1 }} />
//                         <Typography variant="h6" color="primary">₹{fare}</Typography>
//                     </Box>

//                     {status === 'Confirmed' ? (
//                         <Button variant="outlined" color="error" onClick={() => onCancel(id)}>
//                             Cancel Ride
//                         </Button>
//                     ) : (
//                         <Button variant="outlined" color="primary">
//                             View Details
//                         </Button>
//                     )}
//                 </Grid>

//             </Grid>
//         </Paper>
//     );
// };

// // ✅ MAIN COMPONENT
// const BookedCabsList = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [userId, setUserId] = useState(null);

//     // ✅ 1. First, fetch the current user's ID
//     useEffect(() => {
//         const fetchUserId = async () => {
//             try {
//                 const token = localStorage.getItem("authToken");
//                 if (!token) {
//                     throw new Error("No authentication token found");
//                 }

//                 const response = await fetch(`${BASE_URL}user/me`, {
//                     headers: {
//                         "Authorization": `Bearer ${token}`
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch user data");
//                 }

//                 const userData = await response.json();
//                 console.log(userData, "userData");
                
//                 setUserId(userData.data.id);
//             } catch (err) {
//                 console.error("Error fetching user data:", err);
//                 setError("Failed to load user data. Please log in again.");
//                 setLoading(false);
//             }
//         };

//         fetchUserId();
//     }, []);

//     // ✅ 2. Then fetch rides when userId is available
//     useEffect(() => {
//         if (!userId) return; // Wait until we have a userId

//         const fetchRides = async () => {
//             try {
//                 const token = localStorage.getItem("authToken");
//                 const response = await fetch(`${BASE_URL}user/${userId}/rides`, {
//                     headers: {
//                         "Authorization": `Bearer ${token}`
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch rides");
//                 }

//                 const data = await response.json();
//                 setBookings(data.data.rides || []);
//             } catch (err) {
//                 console.error("Error fetching rides:", err);
//                 setError("Failed to load ride history");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRides();
//     }, [userId]); // This effect depends on userId

//     // ✅ CANCEL BOOKING API (updated to use the correct endpoint)
//     const handleCancel = async (id) => {
//         const confirmCancel = window.confirm("Are you sure you want to cancel this ride?");
//         if (!confirmCancel) return;

//         try {
//             const token = localStorage.getItem("token");
//             const response = await fetch(`${BASE_URL}rides/${id}/cancel`, {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 }
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Failed to cancel ride");
//             }

//             // Update local state to reflect the cancellation
//             setBookings(prev => 
//                 prev.map(booking => 
//                     booking.id === id ? { ...booking, status: "Cancelled" } : booking
//                 )
//             );
            
//             // Show success message
//             alert("Ride cancelled successfully!");

//         } catch (error) {
//             console.error("Error cancelling ride:", error);
//             alert(error.message || "Failed to cancel ride. Please try again.");
//         }
//     };

//     // Filter bookings
//     const upcoming = bookings.filter(b => b.status === "Confirmed");
//     const past = bookings.filter(b => b.status !== "Confirmed");

//     // Render loading state
//     if (loading) {
//         return (
//             <ThemeProvider theme={professionalTheme}>
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//                     <CircularProgress />
//                 </Box>
//             </ThemeProvider>
//         );
//     }

//     // Render error state
//     if (error) {
//         return (
//             <ThemeProvider theme={professionalTheme}>
//                 <Box sx={{ p: 3, textAlign: 'center' }}>
//                     <Typography color="error">{error}</Typography>
//                     <Button 
//                         variant="contained" 
//                         color="primary" 
//                         sx={{ mt: 2 }}
//                         onClick={() => window.location.href = '/login'}
//                     >
//                         Go to Login
//                     </Button>
//                 </Box>
//             </ThemeProvider>
//         );
//     }

//     // Main render
//     return (
//         <>
//             <Header />
//             <ThemeProvider theme={professionalTheme}>
//                 <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
//                     <Container maxWidth="lg">
//                         <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
//                             My Trip
//                         </Typography>

//                         {/* Upcoming Rides */}
//                         <Typography variant="h5" sx={{ mb: 3, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
//                             Upcoming Rides ({upcoming.length})
//                         </Typography>
                        
//                         {upcoming.length > 0 ? (
//                             upcoming.map(booking => (
//                                 <CabCard 
//                                     key={booking.id} 
//                                     booking={booking} 
//                                     onCancel={handleCancel} 
//                                 />
//                             ))
//                         ) : (
//                             <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
//                                 <Typography>No upcoming rides found.</Typography>
//                                 <Button 
//                                     variant="contained" 
//                                     color="primary" 
//                                     sx={{ mt: 2 }}
//                                     onClick={() => window.location.href = '/'}
//                                 >
//                                     Book a Ride
//                                 </Button>
//                             </Paper>
//                         )}

//                         <Divider sx={{ my: 5 }} />

//                         {/* Past Rides */}
//                         <Typography variant="h5" sx={{ mb: 3, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
//                             Past Rides ({past.length})
//                         </Typography>
                        
//                         {past.length > 0 ? (
//                             past.map(booking => (
//                                 <CabCard 
//                                     key={booking.id} 
//                                     booking={booking} 
//                                     onCancel={handleCancel}
//                                 />
//                             ))
//                         ) : (
//                             <Paper sx={{ p: 3, textAlign: 'center' }}>
//                                 <Typography>No past rides found.</Typography>
//                             </Paper>
//                         )}
//                     </Container>
//                 </Box>
//             </ThemeProvider>
//             <Footer />
//         </>
//     );
// };

// export default BookedCabsList;
