import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Paper,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Footer from '../components/layout/Footer';
import SubscribeBar from '../components/SubscribeBar';
import Header from '../components/layout/Header';
import authService from '../apiServices/auth.js';
import { setUserInfo } from '../slices/users.js';
import { useDispatch } from 'react-redux';

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

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    const userContact = localStorage.getItem('userContact');
    // if (!userContact) {
    //   setError('Session expired. Please try signing up again.');
    //   return;
    // }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.verifyOtp({
        identifier: userContact,
        token: otp
      });

      // Show success message and display password card
      setSuccess('OTP verified successfully! Please set your password.');
      setShowPasswordCard(true);

      // Save token and user info to localStorage
      localStorage.setItem('authToken', response.token);
      // localStorage.setItem('userInfo', JSON.stringify(response.user || {}));
      dispatch(setUserInfo(response))
      // Clear OTP form
      setOtp('');
      // navigate('/profile');
    } catch (error) {
      console.error('OTP verification error:', error);
      // setError(error.message || 'Invalid OTP. Please try again.');
      // toast.error(error.message || 'Invalid OTP. Please try again.')
            setToast({
              open: true,
              message: error.message || 'Invalid OTP. Please try again.',
              severity: 'error'
            });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData(prev => ({ ...prev, [field]: event.target.value }));
    if (error) setError('');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = passwordData;

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userContact = localStorage.getItem('userContact');
    if (!userContact) {
      setError('Session expired. Please try signing up again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.setPassword({
        identifier: userContact,
        password: password
      });

      // Show success toast
      setToast({
        open: true,
        message: 'Password set successfully! Redirecting to login...',
        severity: 'success'
      });

      // Clear password data
      setPasswordData({ password: '', confirmPassword: '' });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Set password error:', error);
      setError(error.message || 'Failed to set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    // For now, just clear the current OTP and show a message
    setOtp('');
    setError('');
    setSuccess('OTP resent successfully. Please check your email/phone.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <>
      <Header />
      <ThemeProvider theme={purpleTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '75vh', display: 'flex', alignItems: 'center', py: 6 }}>
          <Container maxWidth="sm">
            {/* OTP Verification Card */}
            
            {!showPasswordCard && (
              <Fade in>
              <Paper sx={{ p: { xs: 3, md: 5 }, mb: showPasswordCard ? 3 : 0 }}>
                <Typography variant="h4" align="center" gutterBottom>
                  Verify Your Account
                </Typography>

                <Typography variant="body2" align="center" sx={{ mb: 3, color: '#666' }}>
                  We've sent a 6-digit verification code to{' '}
                  <strong>{localStorage.getItem('userContact')}</strong>
                </Typography>

                {/* {error && (
                  <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                    {error}
                  </Typography>
                )} */}

                {success && (
                  <Typography variant="body2" color="success.main" sx={{ mb: 2, textAlign: 'center' }}>
                    {success}
                  </Typography>
                )}

                <Box component="form" onSubmit={handleVerifyOtp}>
                  <TextField
                    label="Enter 6-digit OTP"
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    inputProps={{ maxLength: 6 }}
                    sx={{ mb: 3 }}
                    placeholder="000000"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isLoading || otp.length !== 6}
                    sx={{ mb: 2 }}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Didn't receive the code?{' '}
                      <Link
                        href="#"
                        onClick={handleResendOtp}
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                      >
                        Resend OTP
                      </Link>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Check your spam folder if you don't see it in your inbox
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                  Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our{' '}
                  <Link href="#" color="primary">privacy policy</Link>.
                </Typography>
              </Paper>
            </Fade>
            )}
            {/* Password Setting Card */}
          
            {showPasswordCard && (
               <Fade in>
               <Paper sx={{ p: { xs: 3, md: 5 } }}>
                 <Typography variant="h4" align="center" gutterBottom>
                   Set Your Password
                 </Typography>
 
                 <Typography variant="body2" align="center" sx={{ mb: 3, color: '#666' }}>
                   Create a secure password for your account
                 </Typography>
 
                 {error && (
                   <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                     {error}
                   </Typography>
                 )}
 
                 <Box component="form" onSubmit={handleSetPassword}>
                   <TextField
                     label="Set Password"
                     type={showPassword ? 'text' : 'password'}
                     value={passwordData.password}
                     onChange={handlePasswordChange('password')}
                     sx={{ mb: 2 }}
                     placeholder="Enter your password"
                     InputProps={{
                       endAdornment: (
                         <InputAdornment position="end">
                           <IconButton onClick={() => togglePasswordVisibility('password')} edge="end">
                             {showPassword ? <VisibilityOff /> : <Visibility />}
                           </IconButton>
                         </InputAdornment>
                       ),
                     }}
                   />
 
                   <TextField
                     label="Confirm Password"
                     type={showConfirmPassword ? 'text' : 'password'}
                     value={passwordData.confirmPassword}
                     onChange={handlePasswordChange('confirmPassword')}
                     sx={{ mb: 3 }}
                     placeholder="Confirm your password"
                     InputProps={{
                       endAdornment: (
                         <InputAdornment position="end">
                           <IconButton onClick={() => togglePasswordVisibility('confirmPassword')} edge="end">
                             {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                           </IconButton>
                         </InputAdornment>
                       ),
                     }}
                   />
 
                   <Button
                     type="submit"
                     variant="contained"
                     color="primary"
                     fullWidth
                     size="large"
                     disabled={isLoading}
                     sx={{ mb: 2 }}
                   >
                     {isLoading ? 'Setting Password...' : 'Set Password'}
                   </Button>
                 </Box>
 
                 <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                   Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our{' '}
                   <Link href="#" color="primary">privacy policy</Link>.
                 </Typography>
               </Paper>
             </Fade>
            )}
          </Container>
        </Box>
      </ThemeProvider>

      {/* Success Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <SubscribeBar />
      <Footer/>
    </>
  );
};

export default VerifyOtpPage;