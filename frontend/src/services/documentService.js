import api from './api';

/**
 * Service for document-related API operations
 */
const documentService = {
  /**
   * Get all documents
   * @returns {Promise} - Promise resolving to array of documents
   */
  getAllDocuments: async () => {
    try {
      const response = await api.get('/documents/');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },
  
  /**
   * Get a document by ID
   * @param {string} id - Document ID
   * @returns {Promise} - Promise resolving to document data
   */
  getDocumentById: async (id) => {
    try {
      const response = await api.get(`/documents/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Upload documents
   * @param {FormData} formData - Form data containing files and metadata
   * @param {Function} onUploadProgress - Progress callback
   * @returns {Promise} - Promise resolving to upload result
   */
  uploadDocuments: async (formData, onUploadProgress) => {
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          }
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  },
  
  /**
   * Delete a document
   * @param {string} id - Document ID
   * @returns {Promise} - Promise resolving when document is deleted
   */
  deleteDocument: async (id) => {
    try {
      await api.delete(`/documents/${id}/`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get document analysis
   * @param {string} id - Document ID
   * @returns {Promise} - Promise resolving to document analysis data
   */
  getDocumentAnalysis: async (id) => {
    try {
      const response = await api.get(`/documents/${id}/analysis/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document analysis for ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Update document metadata
   * @param {string} id - Document ID
   * @param {Object} metadata - Updated metadata
   * @returns {Promise} - Promise resolving to updated document
   */
  updateDocumentMetadata: async (id, metadata) => {
    try {
      const response = await api.patch(`/documents/${id}/`, metadata);
      return response.data;
    } catch (error) {
      console.error(`Error updating document ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Check document processing status
   * @param {string} id - Document ID
   * @returns {Promise} - Promise resolving to document status
   */
  checkDocumentStatus: async (id) => {
    try {
      const response = await api.get(`/documents/${id}/status/`);
      return response.data;
    } catch (error) {
      console.error(`Error checking status for document ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get document categories
   * @returns {Promise} - Promise resolving to array of document categories
   */
  getDocumentCategories: async () => {
    try {
      const response = await api.get('/documents/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching document categories:', error);
      // Return empty array instead of throwing
      return [];
    }
  }
};

export default documentService;