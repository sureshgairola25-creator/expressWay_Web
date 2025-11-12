import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom for navigation

// 1. Define a custom MUI theme with a purple primary color
const purpleTheme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // Deep Purple
    },
    secondary: {
      main: '#ffab00', // Amber for contrast
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '6rem',
      fontWeight: 900,
    },
    h4: {
      fontWeight: 500,
    },
  },
});

const NotFoundPage = () => {
  return (
    <ThemeProvider theme={purpleTheme}>
      {/* CssBaseline resets basic CSS for a consistent look */}
      <CssBaseline /> 
      <Box
        sx={{
          minHeight: '100vh', // Ensure it fills the screen
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9', // Light background for contrast
          textAlign: 'center',
          py: 8, // Padding on Y-axis
        }}
      >
        <Container maxWidth="sm">
          {/* Main Error Code (H1 with purple color) */}
          <Typography
            variant="h1"
            component="h1"
            color="primary"
            gutterBottom
          >
            404
          </Typography>

          {/* Icon and Error Message (H4) */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <WarningIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography variant="h4" color="textPrimary">
              Page Not Found
            </Typography>
          </Box>
          
          {/* Detailed Description */}
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, px: 2 }}>
            We're sorry, but the page you are looking for might have been removed,
            had its name changed, or is temporarily unavailable.
          </Typography>

          {/* Action Button */}
          <Button
            component={Link} // Use Link for internal navigation
            to="/" // Link back to the home page
            variant="contained"
            color="primary"
            size="large"
            sx={{
              textTransform: 'none', // Professional button text styling
              fontWeight: 'bold',
              letterSpacing: 1,
              '&:hover': {
                backgroundColor: purpleTheme.palette.primary.dark,
              },
            }}
          >
            Go to Homepage
          </Button>

          {/* Professional Footer / Branding */}
          <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #eee' }}>
            <Typography variant="caption" color="textSecondary">
              If the problem persists, please contact support.
            </Typography>
          </Box>

        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default NotFoundPage;