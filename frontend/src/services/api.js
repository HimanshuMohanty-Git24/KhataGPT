import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with common config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 responses (Unauthorized) - useful for token refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Handle token refresh logic here if needed
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
const documentService = {
  getAllDocuments: () => api.get('/documents/'),
  getDocument: (id) => api.get(`/documents/${id}/`),
  uploadDocuments: (formData, onUploadProgress) => 
    api.post('/upload-documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    }),
  deleteDocument: (id) => api.delete(`/documents/${id}/`),
};

const chatService = {
  sendMessage: (documentId, query) => api.post(`/chat/${documentId}/`, { query }),
};

// Export services
export { api, documentService, chatService };

// Export the default api instance
export default api;