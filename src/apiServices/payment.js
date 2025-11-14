import apiClient from '../api/apiClient';

const API_ENDPOINTS = {
  BOOKING: 'booking/initiate'
};


export async function initiateCheckout(userId, tripId, age, selectedSeats, totalAmount, pickupPointId, dropPointId, customerEmail, customerPhone, selectedMeal) {
  try {
    console.log("Initiating checkout for:", { userId, tripId, selectedSeats, totalAmount, pickupPointId, dropPointId, customerEmail, customerPhone });
    const response = await apiClient.post(API_ENDPOINTS.BOOKING, {
      userId,
      tripId,
      age,
      selectedSeats,
      totalAmount,
      pickupPointId,
      dropPointId,    
      customerEmail,
      customerPhone,
      selectedMeal 
    });
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}