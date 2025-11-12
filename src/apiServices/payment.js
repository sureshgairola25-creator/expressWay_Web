import apiClient from '../api/apiClient';

const API_ENDPOINTS = {
  BOOKING: 'booking/initiate'
};


export async function initiateCheckout(userId, tripId, selectedSeats, totalAmount) {
  try {
    console.log("Initiating checkout for:", { userId, tripId, selectedSeats, totalAmount });
    const response = await apiClient.post(API_ENDPOINTS.BOOKING, {
      userId,
      tripId,
      age: "25",
      selectedSeats,
      totalAmount,
      customerEmail: "sureshgairola23@gmail.com",
      customerPhone: "9917098722"
    });
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}