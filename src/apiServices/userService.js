import apiClient from '../api/apiClient';

/**
 * User management API services
 */
export const userService = {
  /**
   * Get list of users
   * @returns {Promise} API response with user list
   */
  getUsers: async () => {
    return await apiClient.get('user/users');
  },

  // Add more user-related API calls here as needed
};

export default userService;
