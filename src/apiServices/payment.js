import apiClient from '../api/apiClient';

const API_ENDPOINTS = {
  BOOKING: 'booking/initiate'
};


export async function initiateCheckout(userId, tripId, age, selectedSeats, totalAmount, couponInput, finalTotal, discountAmount, pickupPointId, dropPointId, customerEmail, customerPhone, selectedMeal,journeyDate) {
  try {
    console.log("Initiating checkout for:", { userId, tripId, selectedSeats, totalAmount, pickupPointId, dropPointId, customerEmail, customerPhone,journeyDate });
    const response = await apiClient.post(API_ENDPOINTS.BOOKING, {
      userId,
      tripId,
      age,
      selectedSeats,
      totalAmount:totalAmount,
      couponCode:couponInput,
      finalPayableAmount:finalTotal,
      discountAmount:discountAmount,
      pickupPointId,
      dropPointId,    
      customerEmail,
      customerPhone,
      selectedMeal,
      journeyDate
    });
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}