import apiClient from '../api/apiClient';

const API_ENDPOINTS = {
  BOOKING: 'booking/list'
};


export async function getAllBookings() {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BOOKING);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}
      