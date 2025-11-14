import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { getCouponById, createCoupon, updateCoupon } from "../../../../src/apiServices/couponService";

const validationSchema = Yup.object({
  code: Yup.string()
    .required('Coupon code is required')
    .max(20, 'Code must be at most 20 characters'),
  description: Yup.string().max(255, 'Description must be at most 255 characters'),
  discount_type: Yup.string().oneOf(['percentage', 'flat'], 'Invalid discount type').required('Required'),
  discount_value: Yup.number()
    .typeError('Must be a number')
    .positive('Must be positive')
    .required('Required')
    .when('discount_type', {
      is: 'percentage',
      then: (schema) => schema.max(100, 'Percentage must be between 0 and 100'),
    }),
  min_order_amount: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Must be 0 or more')
    .required('Required'),
  max_discount_amount: Yup.number()
    .typeError('Must be a number')
    .when('discount_type', {
      is: 'percentage',
      then: (schema) => schema.min(0, 'Must be 0 or more').required('Required'),
    }),
  start_date: Yup.date().required('Start date is required'),
  end_date: Yup.date()
    .required('End date is required')
    .min(Yup.ref('start_date'), 'End date must be after start date'),
  status: Yup.boolean(),
  usage_limit_per_user: Yup.number()
    .typeError('Must be a number')
    .integer('Must be an integer')
    .min(1, 'Must be at least 1')
    .required('Required'),
  total_usage_limit: Yup.number()
    .typeError('Must be a number')
    .integer('Must be an integer')
    .min(1, 'Must be at least 1')
    .required('Required'),
  image: Yup.mixed().nullable(),
});

const CouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [loading, setLoading] = useState(isEditMode);
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '',
      max_discount_amount: '',
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: true,
      usage_limit_per_user: 1,
      total_usage_limit: 100,
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formattedValues = {
          ...values,
          code: values.code.toUpperCase(),
          status: values.status ? 'active' : 'inactive',
        };

        if (isEditMode) {
          await updateCoupon(id, formattedValues);
          toast.success('Coupon updated successfully');
        } else {
          await createCoupon(formattedValues);
          toast.success('Coupon created successfully');
        }
        navigate('/admin/coupons');
      } catch (error) {
        console.error('Error saving coupon:', error);
        toast.error(`Failed to ${isEditMode ? 'update' : 'create'} coupon`);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCoupon = async () => {
      try {
        const coupon = await getCouponById(id);
        console.log(coupon);
        formik.setValues({
          ...coupon.data,
          status: coupon.data.status === 'active',
          start_date: new Date(coupon.data.start_date),
          end_date: new Date(coupon.data.end_date),
        });
        if (coupon.data.image) {
          setImagePreview(coupon.data.image);
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
        toast.error('Failed to load coupon data');
        navigate('/admin/coupons');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id, isEditMode]);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    formik.setFieldValue('image', file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    formik.setFieldValue('image', null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/coupons')}
          sx={{ mb: 2 }}
        >
          Back to Coupons
        </Button>
        
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Coupon' : 'Create New Coupon'}
        </Typography>
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Coupon Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="code"
                        name="code"
                        label="Coupon Code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.code && Boolean(formik.errors.code)}
                        helperText={formik.touched.code && formik.errors.code}
                        disabled={isEditMode}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="discount-type-label">Discount Type</InputLabel>
                        <Select
                          labelId="discount-type-label"
                          id="discount_type"
                          name="discount_type"
                          value={formik.values.discount_type}
                          label="Discount Type"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.discount_type && Boolean(formik.errors.discount_type)}
                        >
                          <MenuItem value="percentage">Percentage</MenuItem>
                          <MenuItem value="flat">Flat Amount</MenuItem>
                        </Select>
                        {formik.touched.discount_type && formik.errors.discount_type && (
                          <FormHelperText error>{formik.errors.discount_type}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="discount_value"
                        name="discount_value"
                        label={
                          formik.values.discount_type === 'percentage'
                            ? 'Discount Percentage'
                            : 'Discount Amount'
                        }
                        type="number"
                        value={formik.values.discount_value}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.discount_value && Boolean(formik.errors.discount_value)}
                        helperText={formik.touched.discount_value && formik.errors.discount_value}
                        InputProps={{
                          endAdornment: formik.values.discount_type === 'percentage' ? '%' : '₹',
                        }}
                      />
                    </Grid>
                    
                    {formik.values.discount_type === 'percentage' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="max_discount_amount"
                          name="max_discount_amount"
                          label="Maximum Discount Amount (₹)"
                          type="number"
                          value={formik.values.max_discount_amount}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.max_discount_amount &&
                            Boolean(formik.errors.max_discount_amount)
                          }
                          helperText={
                            formik.touched.max_discount_amount && formik.errors.max_discount_amount
                          }
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="min_order_amount"
                        name="min_order_amount"
                        label="Minimum Order Amount (₹)"
                        type="number"
                        value={formik.values.min_order_amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.min_order_amount && Boolean(formik.errors.min_order_amount)
                        }
                        helperText={
                          formik.touched.min_order_amount && formik.errors.min_order_amount
                        }
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="description"
                        name="description"
                        label="Description"
                        multiline
                        rows={3}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={
                          (formik.touched.description && formik.errors.description) ||
                          'A brief description of the coupon (optional)'
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Usage Limits
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="usage_limit_per_user"
                        name="usage_limit_per_user"
                        label="Usage Limit Per User"
                        type="number"
                        value={formik.values.usage_limit_per_user}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.usage_limit_per_user &&
                          Boolean(formik.errors.usage_limit_per_user)
                        }
                        helperText={
                          formik.touched.usage_limit_per_user && formik.errors.usage_limit_per_user
                        }
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="total_usage_limit"
                        name="total_usage_limit"
                        label="Total Usage Limit"
                        type="number"
                        value={formik.values.total_usage_limit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.total_usage_limit &&
                          Boolean(formik.errors.total_usage_limit)
                        }
                        helperText={
                          formik.touched.total_usage_limit && formik.errors.total_usage_limit
                        }
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik.values.status}
                            onChange={(e) => formik.setFieldValue('status', e.target.checked)}
                            name="status"
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography>Status</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formik.values.status ? 'Active' : 'Inactive'}
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Coupon Image
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box
                    sx={{
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                    onClick={() => document.getElementById('coupon-image-upload').click()}
                  >
                    <input
                      id="coupon-image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    
                    {imagePreview ? (
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="Coupon Preview"
                          sx={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            display: 'block',
                            margin: '0 auto',
                            borderRadius: 1,
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          sx={{ mt: 1 }}
                        >
                          Remove Image
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ py: 4 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Click to upload an image
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Recommended size: 600x400px
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <FormHelperText error={formik.touched.image && Boolean(formik.errors.image)}>
                    {formik.touched.image && formik.errors.image}
                  </FormHelperText>
                </CardContent>
              </Card> */}
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/admin/coupons')}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading || !formik.isValid || formik.isSubmitting}
                >
                  {isEditMode ? 'Update Coupon' : 'Create Coupon'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default CouponForm;
