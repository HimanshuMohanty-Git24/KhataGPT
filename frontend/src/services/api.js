import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for handling auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or other headers here
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors and handle specific status codes
    console.error('API Error:', error);
    
    // Handle unauthorized errors
    if (error.response && error.response.status === 401) {
      // Handle unauthorized
    }
    
    return Promise.reject(error);
  }
);

export default api;