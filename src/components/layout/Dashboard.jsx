import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CommuteIcon from '@mui/icons-material/Commute';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import PageContainer from './PageContainer';
import { getDashboardStats } from '../../apiServices/dashboardService';

// Color palette for charts
const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d81b60', '#00897b', '#8e24aa', '#e53935'];

// Format number with commas
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format stat cards data
  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers ? formatNumber(stats.totalUsers) : '0', 
      icon: <PeopleIcon />, 
      color: '#1976d2' 
    },
    { 
      title: 'Total Trips', 
      value: stats?.totalTrips ? formatNumber(stats.totalTrips) : '0', 
      icon: <CommuteIcon />, 
      color: '#388e3c' 
    },
    { 
      title: 'Total Bookings', 
      value: stats?.totalBookings ? formatNumber(stats.totalBookings) : '0', 
      icon: <ConfirmationNumberIcon />, 
      color: '#f57c00' 
    },
    { 
      title: 'Total Cars', 
      value: stats?.totalCars ? formatNumber(stats.totalCars) : '0', 
      icon: <CommuteIcon />, 
      color: '#7b1fa2' 
    },
  ];

  // Format trips per week data for chart
  const tripsPerWeekData = stats?.tripsPerWeek?.map(item => ({
    week: item.week.split('-W')[1], // Extract just the week number
    trips: item.count
  })) || [];

  // Format revenue by route data for chart
  const revenueByRouteData = stats?.revenueByRoute?.map(item => ({
    name: item.route,
    value: item.total
  })) || [];

  // Calculate total revenue for the revenue card
  const totalRevenue = revenueByRouteData.reduce((sum, item) => sum + item.value, 0);
  
  // Add total revenue to stat cards if not already present
  if (statCards.length === 4) {
    statCards[3] = { 
      title: 'Total Revenue', 
      value: formatCurrency(totalRevenue), 
      icon: <AttachMoneyIcon />, 
      color: '#7b1fa2' 
    };
  }

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        console.log(response,'response');
        
        if (response.success) {
          setStats(response.data);
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageContainer>
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        {/* Top Cards Section */}
        <Grid 
          container
          spacing={2}
          sx={{
            '--Grid-columns': 12,
            '--Grid-columnSpacing': '16px !important',
            '--Grid-rowSpacing': '16px !important',
            mb: 2,
          }}
        >
          {statCards.map((card, index) => (
            <Grid  className="flex-1" item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 3,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 5,
                  },
                }}
              >
                <Avatar sx={{ bgcolor: card.color, mr: 2, width: 48, height: 48 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {card.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid 
          container
          spacing={2}
          sx={{
            '--Grid-columns': 12,
            '--Grid-columnSpacing': '16px !important',
            '--Grid-rowSpacing': '16px !important',
            mt: 2,
          }}
        >
          {/* Left Chart - Trips per Week */}
          <Grid item xs={12} md={6} className="flex-1">
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Trips per Week
                </Typography>
                {tripsPerWeekData.length > 0 ? (
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <AreaChart data={tripsPerWeekData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="week" 
                          label={{ value: 'Week', position: 'insideBottomRight', offset: -5 }} 
                        />
                        <YAxis 
                          label={{ value: 'Trips', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value} trips`, 'Trips']}
                          labelFormatter={(week) => `Week ${week}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="trips"
                          name="Trips"
                          stroke="#1976d2"
                          fill="#1976d2"
                          fillOpacity={0.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="250px"
                  >
                    <Typography color="textSecondary">No trip data available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Chart - Revenue by Route */}
          <Grid item xs={12} md={6} className="flex-1">
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Revenue by Route
                  </Typography>
                  {totalRevenue > 0 && (
                    <Typography variant="subtitle2" color="textSecondary">
                      Total: {formatCurrency(totalRevenue)}
                    </Typography>
                  )}
                </Box>
                {revenueByRouteData.length > 0 ? (
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={revenueByRouteData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => 
                            `${name.split('→')[0].trim()}\n${(percent * 100).toFixed(0)}%`
                          }
                          dataKey="value"
                          nameKey="name"
                          labelLine={true}
                        >
                          {revenueByRouteData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [
                            formatCurrency(value), 
                            name
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="250px"
                  >
                    <Typography color="textSecondary">No revenue data available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
