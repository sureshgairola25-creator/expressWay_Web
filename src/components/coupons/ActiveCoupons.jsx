import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LocalOffer as OfferIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import { getActiveCoupons } from '../../src/apiServices/couponService';

const ActiveCoupons = ({ onApplyCoupon, appliedCouponCode }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        setLoading(true);
        const data = await getActiveCoupons();
        setCoupons(data.map(coupon => ({
          ...coupon,
          discountInfo: coupon.discountType === 'percentage' 
            ? `${coupon.discountValue}% OFF` 
            : `₹${coupon.discountValue} OFF`,
          minOrderText: `Min. order: ₹${coupon.minOrderAmount}`,
        })));
      } catch (err) {
        console.error('Error fetching active coupons:', err);
        setError('Failed to load coupons. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setSnackbar({
      open: true,
      message: 'Coupon code copied to clipboard!',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return <div>Loading available coupons...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (coupons.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <OfferIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="body1" color="textSecondary">
          No active coupons available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {coupons.map((coupon) => (
          <Grid item xs={12} sm={6} md={4} key={coupon._id}>
            <Card 
              variant="outlined" 
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderColor: appliedCouponCode === coupon.code ? 'primary.main' : 'divider',
                borderWidth: appliedCouponCode === coupon.code ? 2 : 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box display="flex" alignItems="center">
                    <OfferIcon 
                      color="primary" 
                      sx={{ 
                        mr: 1,
                        fontSize: 28,
                        color: theme.palette.primary.main,
                      }} 
                    />
                    <Typography 
                      variant="h6" 
                      component="div"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {coupon.code}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCode(coupon.code);
                      }}
                      sx={{ ml: 0.5 }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Chip 
                    label={coupon.discountInfo}
                    color="primary"
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    }}
                  />
                </Box>

                {coupon.description && (
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {coupon.description}
                  </Typography>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    {coupon.minOrderText}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Valid until: {new Date(coupon.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
              
              <Box p={2} pt={0}>
                <Button
                  fullWidth
                  variant={appliedCouponCode === coupon.code ? 'outlined' : 'contained'}
                  color="primary"
                  size="small"
                  onClick={() => onApplyCoupon(coupon.code)}
                  disabled={appliedCouponCode === coupon.code}
                >
                  {appliedCouponCode === coupon.code ? 'Applied' : 'Apply'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActiveCoupons;
