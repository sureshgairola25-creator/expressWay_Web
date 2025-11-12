import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CompleteProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user registered with email (this would be passed or checked from context)
  // For now, assume if email is set but mobile isn't, show verify button
  const needsMobileVerification = email && !mobileNumber;

  const handleSaveDetails = async () => {
    if (!firstName || !lastName || !gender) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    const payload = { firstName, lastName, email: email || undefined, mobileNumber: mobileNumber || undefined, gender };

    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        navigate('/');
      } else {
        const errorData = await response.json();
        console.error('Profile update failed:', errorData);
        alert('Profile update failed: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMobile = async () => {
    if (!mobileNumber) {
      alert('Please enter your mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      if (response.ok) {
        console.log('OTP sent for mobile verification');
        setShowOtpInput(true);
        alert('OTP sent successfully! Please check your phone.');
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

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: mobileNumber, otp }),
      });

      if (response.ok) {
        console.log('Mobile verified successfully');
        setShowOtpInput(false);
        // Optionally update profile or proceed
        alert('Mobile verified successfully!');
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
            Complete Your Profile
          </Typography>

          <Box component="form" noValidate autoComplete="off" sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              sx={{ mb: 2 }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              sx={{ mb: 2 }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Mobile Number"
              type="tel"
              variant="outlined"
              sx={{ mb: 2 }}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <TextField
              select
              fullWidth
              label="Gender"
              variant="outlined"
              sx={{ mb: 3 }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

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
              onClick={handleSaveDetails}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Details'}
            </Button>
          </Box>

          {needsMobileVerification && (
            <>
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" sx={{ color: '#888' }}>or</Typography>
              </Divider>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#7c3aed',
                  color: '#7c3aed',
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2,
                  mb: 2
                }}
                onClick={handleVerifyMobile}
                disabled={isLoading}
              >
                Verify Mobile Number
              </Button>
            </>
          )}

          {showOtpInput && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Enter OTP for Mobile Verification
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
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
