import axios from '../api/apiClient';

/**
 * Fetches dashboard statistics from the server
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await axios.get('/admin/dashboard-stats');
    return response;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Formats the trips per week data for the chart
 * @param {Array} tripsData - Raw trips per week data from API
 * @returns {Array} Formatted data for the chart
 */
export const formatTripsPerWeekData = (tripsData) => {
  return tripsData.map(item => ({
    week: item.week,
    trips: item.count
  }));
};

/**
 * Formats the revenue by route data for the chart
 * @param {Array} revenueData - Raw revenue data from API
 * @returns {Array} Formatted data for the chart
 */
export const formatRevenueByRouteData = (revenueData) => {
  return revenueData.map(item => ({
    name: item.route,
    value: item.total
  }));
};
