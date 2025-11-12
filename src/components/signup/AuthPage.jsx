import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';


export default function AuthPage() {
  const [input, setInput] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const countryCodes = [
    { value: '+91', label: '+91 (IND)' },
    { value: '+1', label: '+1 (USA)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+971', label: '+971 (UAE)' },
  ];

  // Check if input is email or phone
  const isEmail = (str) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  const handleGenerateOtp = async () => {
    if (!input.trim()) {
      alert('Please enter your mobile number or email');
      return;
    }

    setIsLoading(true);
    const payload = isEmail(input)
      ? { email: input }
      : { mobile: countryCode + input };

    try {
      const response = await fetch('/api/users/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('OTP sent successfully');
        setShowOtpInput(true);
        alert('OTP sent successfully! Please check your ' + (isEmail(input) ? 'email' : 'phone'));
      } else {
        const errorData = await response.json();
        console.error('Failed to send OTP:', errorData);
        alert('Failed to send OTP: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('An error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login success:', credentialResponse);
    // Here you would typically send the token to your backend to verify and create a session
    // For now, let's simulate a login by storing the credential
    localStorage.setItem('token', credentialResponse.credential);
    navigate('/');
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    alert('Google login failed. Please try again.');
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }


    setIsLoading(true);
    const payload = isEmail(input)
      ? { email: input, otp }
      : { mobile: countryCode + input, otp };

    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('OTP verified successfully:', data);
        
        // Store token
        localStorage.setItem('token', data.token);

        // Check if user exists or is new
        if (data.isNewUser) {
          // Redirect to profile completion page
          navigate('/profile-completion');
        } else {
          // Redirect to home
          navigate('/');
        }
      } else {
        const errorData = await response.json();
        console.error('OTP verification failed:', errorData);
        alert('Invalid OTP: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f7', py: 4 }}>
      <Card sx={{ maxWidth: 450, width: '100%', borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#7c3aed', mb: 3, textAlign: 'center' }}>
            Login to get exciting offers
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              What's your mobile number or email?
            </Typography>
            
            {!isEmail(input) && input.length > 0 && (
              <TextField
                select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                sx={{ mb: 2, width: '150px' }}
                size="small"
              >
                {countryCodes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              fullWidth
              placeholder="Enter mobile number or email"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ mb: 2 }}
            />

            {!showOtpInput && (
              <Button
                fullWidth
                variant="contained"
                sx={{ 
                  bgcolor: '#7c3aed', 
                  color: '#fff', 
                  fontWeight: 700, 
                  py: 1.5, 
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#6b2fbc' }
                }}
                onClick={handleGenerateOtp}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'GENERATE OTP'}
              </Button>
            )}
          </Box>

          {showOtpInput && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Enter OTP
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter 6-digit OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ 
                  bgcolor: '#7c3aed', 
                  color: '#fff', 
                  fontWeight: 700, 
                  py: 1.5, 
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#6b2fbc' }
                }}
                onClick={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'VERIFY OTP'}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ color: '#888' }}>or</Typography>
          </Divider>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </Box>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#666', mt: 2 }}>
            By logging in, I agree to{' '}
            <Typography component="span" variant="caption" sx={{ color: '#7c3aed', fontWeight: 600, cursor: 'pointer' }}>
              Terms & Conditions
            </Typography>
            {' & '}
            <Typography component="span" variant="caption" sx={{ color: '#7c3aed', fontWeight: 600, cursor: 'pointer' }}>
              Privacy Policy
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
