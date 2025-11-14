import apiClient from '../api/apiClient';

const API_ENDPOINTS = {
  USER_ME: 'user/me',
  USER_UPDATE: 'user/update',
  USER_RIDES: 'user/rides',
};


export async function getUserDatabyId() {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USER_ME);
    return response;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return {};
  }
}
export async function updateUserDataById(body) {
  try {
    if (!body || !body.id) {
      console.error('Invalid request body or missing user ID');
      return {};
    }
    
    const response = await apiClient.put(
      `${API_ENDPOINTS.USER_UPDATE}/${body.id}`,
      body
    );

    return response;
  } catch (error) {
    console.error("Error in getUserDatabyId:", error);
    return {};
  }
}
export async function fetchUserRides(userId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.USER_RIDES}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user rides:', error);
      return {};
    }
}