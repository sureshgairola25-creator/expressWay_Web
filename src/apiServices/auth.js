import apiClient from '../api/apiClient.js';

/**
 * Authentication API services
 */
export const authService = {
  /**
   * Sign up a new user
   * @param {Object} data - User signup data
   * @param {string} data.email - User email (optional if phone provided)
   * @param {string} data.phone - User phone (optional if email provided)
   * @returns {Promise} API response
   */
  signup: async (data) => {
    return await apiClient.post('user/signup', data);
  },

  /**
   * Verify OTP for signup
   * @param {Object} data - OTP verification data
   * @param {string} data.identifier - User's email or phone
   * @param {string} data.token - OTP code
   * @returns {Promise} API response
   */
  verifyOtp: async (data) => {
    return await apiClient.post('user/verify', data);
  },

  /**
   * Login user
   * @param {Object} data - User login data
   * @param {string} data.identifier - User's email or mobile number
   * @param {string} data.password - User password
   * @returns {Promise} API response
   */
  login: async (data) => {
    return await apiClient.post('user/login', data);
  },

  /**
   * Set password for user after OTP verification
   * @param {Object} data - Password setting data
   * @param {string} data.identifier - User's email or phone
   * @param {string} data.password - User's password
   * @returns {Promise} API response
   */
  setPassword: async (data) => {
    return await apiClient.post('user/set-password', data);
  },

  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: async () => {
    const response = await apiClient.post('users/logout');
    // Clear token from localStorage on successful logout
    localStorage.removeItem('token');
    return response;
  }
};

export default authService;