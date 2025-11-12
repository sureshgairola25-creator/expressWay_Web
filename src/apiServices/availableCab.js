import apiClient from '../api/apiClient';

const API_ENDPOINTS = {
  TRIPS_SEARCH: 'trips/search',
  TRIPS_SEATS: 'trips'
}

export async function getAvailableCabByDate(formCityId, toCityId, date, pickupId, dropCityId) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TRIPS_SEARCH, {
      params: {
        startLocation: formCityId,
        endLocation: toCityId,
        pickupPoint: pickupId,
        dropPoint: dropCityId,
        date: date
      }
    });
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}

export async function getAvailableCabByFilters(formCityId, toCityId, date, pickupId, dropCityId, filters) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TRIPS_SEARCH, {
      params: {
        startLocation: formCityId,
        endLocation: toCityId,
        pickupPoint: pickupId,
        dropPoint: dropCityId,
        date: date,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        timeRange: filters.timeRange.toLowerCase(),
        minSeats: filters.minSeats,
        sortBy: filters.sortBy
      }
    });
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}

export async function getAvailableSeats(cabId) {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.TRIPS_SEATS}/${cabId}/seats`);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}