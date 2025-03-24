import api from './api';

const DOCUMENT_ENDPOINT = '/api/v1/documents';

const documentService = {
  /**
   * Get all documents or search by term
   * @param {string} searchTerm - Optional search term
   * @returns {Promise<Array>} List of documents
   */
  getAllDocuments: async (searchTerm) => {
    const params = searchTerm ? { search: searchTerm } : {};
    const response = await api.get(DOCUMENT_ENDPOINT, { params });
    return response.data;
  },

  /**
   * Get a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Document data
   */
  getDocumentById: async (id) => {
    const response = await api.get(`${DOCUMENT_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Upload a document image
   * @param {File} file - Document image file
   * @returns {Promise<Object>} Processed document data
   */
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(DOCUMENT_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete a document
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Success message
   */
  deleteDocument: async (id) => {
    const response = await api.delete(`${DOCUMENT_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Format a date string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate: (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Get document type label with proper capitalization
   * @param {string} docType - Document type
   * @returns {string} Formatted document type
   */
  getDocTypeLabel: (docType) => {
    if (!docType) return 'Unknown';
    return docType.charAt(0).toUpperCase() + docType.slice(1);
  }
};

export default documentService;