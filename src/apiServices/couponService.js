import apiClient from '../api/apiClient';
import { COUPON_ENDPOINTS } from './endPointContants';

// Admin endpoints
export const getCoupons = async (params = {}) => {
  return apiClient.get(COUPON_ENDPOINTS.BASE, { params });
};

export const getCouponById = async (id) => {
  return apiClient.get(COUPON_ENDPOINTS.BY_ID(id));
};

export const createCoupon = async (couponData) => {
  const formData = new FormData();
  
  // Append all fields to formData
  Object.entries(couponData).forEach(([key, value]) => {
    if (key === 'image' && value) {
      formData.append('image', value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return apiClient.post(COUPON_ENDPOINTS.BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateCoupon = async (id, couponData) => {
  const formData = new FormData();
  
  // Append all fields to formData
  Object.entries(couponData).forEach(([key, value]) => {
    if (key === 'image' && value) {
      formData.append('image', value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return apiClient.put(COUPON_ENDPOINTS.BY_ID(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteCoupon = async (id) => {
  return apiClient.delete(COUPON_ENDPOINTS.BY_ID(id));
};

// Public endpoints
export const getActiveCoupons = async () => {
  try {
    const response = await apiClient.get(COUPON_ENDPOINTS.BASE);
    return response.data.map(coupon => formatCouponForDisplay(coupon));
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    throw error;
  }
};

/**
 * Apply a coupon code to a booking
 * @param {string} code - The coupon code to apply
 * @param {Object} bookingDetails - Booking details including amount, tripId, userId
 * @returns {Promise<Object>} - Returns coupon details if valid, or error information
 */
export const applyCoupon = async (code, bookingDetails) => {
  try {
    if (!code || !bookingDetails || !bookingDetails.amount) {
      return { valid: false, message: 'Invalid coupon code or booking details' };
    }

    const response = await apiClient.post(COUPON_ENDPOINTS.APPLY, { 
      code: code.toUpperCase(),
      amount: parseFloat(bookingDetails.amount),
      tripId: bookingDetails.tripId,
      userId: bookingDetails.userId
    });

    if (response.data && response.data.valid) {
      return {
        valid: true,
        code: response.data.code,
        discountType: response.data.discountType,
        discountValue: parseFloat(response.data.discountValue),
        discountAmount: parseFloat(response.data.discountAmount),
        message: response.data.message || 'Coupon applied successfully',
        coupon: response.data.coupon
      };
    } else {
      return {
        valid: false,
        message: response.data?.message || 'This coupon is not valid for your booking'
      };
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    return {
      valid: false,
      message: error.response?.data?.message || 'Failed to apply coupon. Please try again.'
    };
  }
};

/**
 * Format coupon data for display in the UI
 * @param {Object} coupon - The coupon data from the API
 * @returns {Object} Formatted coupon data with display properties
 */
export const formatCouponForDisplay = (coupon) => {
  if (!coupon) return null;
  
  const formattedCoupon = {
    ...coupon,
    id: coupon._id || coupon.id,
    discountText: coupon.discountType === 'percentage' 
      ? `${coupon.discountValue}% OFF` 
      : `₹${coupon.discountValue} OFF`,
    minOrderAmountText: coupon.minOrderAmount 
      ? `Min. order: ₹${coupon.minOrderAmount}` 
      : 'No minimum order',
    maxDiscountText: coupon.maxDiscountAmount 
      ? `Max. discount: ₹${coupon.maxDiscountAmount}` 
      : 'No maximum discount',
    validityText: coupon.endDate 
      ? `Valid until: ${new Date(coupon.endDate).toLocaleDateString()}` 
      : 'No expiry',
    description: coupon.description || 'Special discount on your booking',
    isExpired: coupon.endDate ? new Date(coupon.endDate) < new Date() : false
  };

  return formattedCoupon;
};
