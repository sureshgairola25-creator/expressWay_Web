import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';

// Define a custom purple theme (can be the same as before or slightly adjusted)
const purpleTheme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // Deep Purple
    },
    secondary: {
      main: '#e57373', // Light Red for contrast/accents
    },
    background: {
      default: '#f4f5f7', // Light gray background
      paper: '#fff',
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
      color: '#333',
    },
    h5: {
      fontWeight: 600,
      color: '#333',
      marginBottom: '20px',
    },
    body2: {
      color: '#777',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Prevent uppercase for buttons
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#5e35b1', // Darker purple on hover
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined', // Modern default variant
        fullWidth: true,
        margin: 'normal',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }
        }
    }
  },
});

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Login attempt');
  };

  const handleRegister = (event) => {
    event.preventDefault();
    // Handle registration logic here
    console.log('Register attempt');
  };

  const handleGoogleLogin = () => {
    console.log('Google Login clicked');
    // Implement Google login flow
  };

  return (
    <ThemeProvider theme={purpleTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: { xs: 3, md: 5 } }}>
            <Grid container spacing={5}>
              {/* Login Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Login
                </Typography>
                <form onSubmit={handleLogin}>
                  <TextField
                    required
                    label="Username or email address"
                    type="email" // Changed to email for better validation/UX
                    name="username"
                  />
                  <TextField
                    required
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Remember me"
                    />
                    <Link href="#" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                      Lost your password?
                    </Link>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ mb: 2 }}
                  >
                    Log in
                  </Button>
                </form>

                <Button
                  variant="outlined"
                  onClick={handleGoogleLogin}
                  startIcon={<GoogleIcon />}
                  fullWidth
                  sx={{ borderColor: purpleTheme.palette.primary.main, color: purpleTheme.palette.primary.main, '&:hover': { borderColor: purpleTheme.palette.primary.dark } }}
                >
                  Continue with Google
                </Button>
              </Grid>

              {/* Register Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Register
                </Typography>
                <form onSubmit={handleRegister}>
                  <TextField
                    required
                    label="Email address"
                    type="email"
                    name="registerEmail"
                  />
                  <Typography variant="body2" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
                    A link to set a new password will be sent to your email address.
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <Link href="#" color="primary">privacy policy</Link>.
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    Register
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthPage;