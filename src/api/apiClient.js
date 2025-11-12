import axios from 'axios';
import config from '../config';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    // Return response data directly for successful requests
    return response.data;
  },
  (error) => {
    // Global error handling
    // console.error('API Error:', {
    //   url: error.config?.url,
    //   method: error.config?.method,
    //   status: error.response?.status,
    //   data: error.response?.data,
    // });

    // Handle different error types
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or handle token refresh
      // console.warn('Unauthorized access - token may be expired');
      // You can add logic here to redirect to login or refresh token
      // localStorage.removeItem('authToken');
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      // console.warn('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      // console.error('Server error occurred');
    }

    // Return a standardized error object
    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
  }
);

export default apiClient;
