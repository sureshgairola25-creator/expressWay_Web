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
  Tabs,
  Tab,
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../layout/Footer';
import SubscribeBar from '../SubscribeBar';
import Header from '../layout/Header';
import authService from '../../apiServices/auth.js';
import { setUserInfo } from '../../slices/users.js';
import { useDispatch, useSelector } from 'react-redux';

const purpleTheme = createTheme({
  palette: {
    primary: { main: '#673ab7', dark: '#5e35b1' },
    secondary: { main: '#e57373' },
    background: { default: '#f4f5f7', paper: '#fff' },
  },
  typography: {
    h4: { fontWeight: 700, color: '#333' },
    h5: { fontWeight: 600, color: '#333', marginBottom: '20px' },
    body2: { color: '#777' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none' },
        containedPrimary: { '&:hover': { backgroundColor: '#5e35b1' } },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true, margin: 'normal' },
      styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } } },
  },
});

const AuthPage = () => {

  const paymentInfo = useSelector((state)=> state?.paymentInfo?.paymentInfo)

  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [signupData, setSignupData] = useState({ identifier: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChangeTab = (event, newValue) => setTabValue(newValue);
  const togglePassword = () => setShowPassword(!showPassword);

  // Helper function to detect if input is email or mobile number
  const detectInputType = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d+$/;

    if (emailRegex.test(value)) {
      return 'email';
    } else if (mobileRegex.test(value)) {
      return 'mobile';
    }
    return 'unknown';
  };

  const handleLoginChange = (field) => (event) => {
    setLoginData(prev => ({ ...prev, [field]: event.target.value }));
    if (error) setError('');
  };

  const handleSignupChange = (field) => (event) => {
    setSignupData(prev => ({ ...prev, [field]: event.target.value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate that the identifier is either a valid email or mobile number
    const inputType = detectInputType(loginData.identifier);
    if (inputType === 'unknown') {
      setError('Please enter a valid email address or mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({
        identifier: loginData.identifier,
        password: loginData.password
      });

      // Save token and user info to localStorage
      localStorage.setItem('authToken', response.token);
      // localStorage.setItem('userInfo', JSON.stringify(response.user || {}));

      dispatch(setUserInfo(response.data))
      // Redirect to home on success
      if (response.data.role == "admin"){
        navigate('/admin/dashboard');
      }else{
        if (paymentInfo){
          navigate('/payment/preview')
        }else{
          navigate('/profile');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google Login clicked');
    // Implement Google login flow
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!signupData.identifier) {
      setError('Please provide either email or phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.signup({ identifier: signupData.identifier });
console.log(response);
      if (response.success) {
        // Save user contact for OTP verification
        const userContact = signupData.identifier;
        localStorage.setItem('userContact', userContact);

        // Redirect to verify-otp page
        navigate('/verify-otp');
        
      } else {
        setError(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => console.log('Google Signup clicked');

  return (
    <>
    <Header />
    <ThemeProvider theme={purpleTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '75vh', display: 'flex', alignItems: 'center', py: 6 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: { xs: 3, md: 5 } }}>
            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>

            {/* Login Form */}
            {tabValue === 0 && (
              <Box component="form" onSubmit={handleLogin}>
                {error && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <TextField
                  label="Email or Mobile Number"
                  placeholder="Enter your email or mobile number"
                  type="text"
                  required
                  value={loginData.identifier}
                  onChange={handleLoginChange('identifier')}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={handleLoginChange('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                  <FormControlLabel control={<Checkbox />} label="Remember me" />
                  <Link href="#" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>Lost your password?</Link>
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mb: 2 }} disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  fullWidth
                  sx={{ borderColor: purpleTheme.palette.primary.main, color: purpleTheme.palette.primary.main, '&:hover': { borderColor: purpleTheme.palette.primary.dark } }}
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </Button>
              </Box>
            )}

            {/* Sign Up Form */}
            {tabValue === 1 && (
              <Box component="form" onSubmit={handleRegister}>
                {error && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <TextField
                  label="Email or Mobile Number"
                  placeholder="Enter Email or Mobile Number"
                  type="text"
                  required
                  value={signupData.identifier}
                  onChange={handleSignupChange('identifier')}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <Link href="#" color="primary">privacy policy</Link>.
                </Typography>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Sign Up'}
                </Button>

                {/* Divider */}
                <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: '#ddd' }} />
                  <Typography variant="body2" sx={{ px: 2, color: '#666' }}>
                    or
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: '#ddd' }} />
                </Box>

                {/* Continue with Google Button */}
                <Button
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  fullWidth
                  sx={{
                    borderColor: purpleTheme.palette.primary.main,
                    color: purpleTheme.palette.primary.main,
                    '&:hover': {
                      borderColor: purpleTheme.palette.primary.dark,
                      backgroundColor: 'rgba(103, 58, 183, 0.04)'
                    }
                  }}
                  onClick={handleGoogleSignup}
                >
                  Continue with Google
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
    <SubscribeBar />
    <Footer/>
    </>
  );
};

export default AuthPage;