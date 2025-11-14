import apiClient from '../api/apiClient';

const API_ENDPOINTS = {
  LOCATIONS: 'locations',
  START: 'start',
  END: 'end',
  PICKUP: 'pickup',
  DROP: 'drop'
};


export async function getFromLocations() {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.LOCATIONS}/${API_ENDPOINTS.START}`);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}

export async function getPickUpLocations(id) {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.LOCATIONS}/${API_ENDPOINTS.START}/${id}/${API_ENDPOINTS.PICKUP}`
    );
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}

export async function getToLocations(id) {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.LOCATIONS}/${API_ENDPOINTS.START}/${id}/${API_ENDPOINTS.END}`
    );
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}

export async function getDropLocations(id) {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.LOCATIONS}/${API_ENDPOINTS.END}/${id}/${API_ENDPOINTS.DROP}`
    );
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}

export async function getLocationsById(startId,pickUpId,destId,dropId){
   try {
    const response = await apiClient.get(`${API_ENDPOINTS.LOCATIONS}/info?startLocation=${startId}&endLocation=${destId}&pickupPoint=${pickUpId}&dropPoint=${dropId}`);
    return response; // Return only response data
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}