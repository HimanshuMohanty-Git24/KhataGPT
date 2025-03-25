import api from './api';

const transformDocument = (doc) => {
  if (!doc) return null;
  
  // Map the doc_type to status - all valid document types should be considered "processed"
  let status = "unknown";
  if (doc.doc_type && doc.doc_type !== "unknown") {
    status = "processed";
  }
  
  return {
    id: doc._id || doc.id,
    filename: doc.title || doc.filename || 'Unnamed document',
    status: status,
    doc_type: doc.doc_type || "unknown",
    uploaded_at: doc.created_at || doc.uploaded_at,
    file_size: doc.file_size || doc.size,
    extracted_text: doc.extracted_text || '',
    image_base64: doc.image_base64 || ''
  };
};

export const documentService = {
  /**
   * Get all documents
   * @returns {Promise} - Promise resolving to documents array
   */
  getAllDocuments: async () => {
    try {
      console.log('Fetching documents from:', `${api.defaults.baseURL}/documents/`);
      
      const response = await api.get('/documents/');
      console.log('Documents API raw response:', response);
      
      // Transform each document
      if (Array.isArray(response.data)) {
        return response.data.map(transformDocument);
      } else if (response.data && Array.isArray(response.data.documents)) {
        return response.data.documents.map(transformDocument);
      } else {
        console.warn('Unexpected data format for documents:', response.data);
        return [];
      }
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
    if (!id || id === 'undefined') {
      throw new Error('Invalid document ID');
    }
    
    try {
      const response = await api.get(`/documents/${id}/`);
      console.log('Full document data:', response.data);
      return transformDocument(response.data);
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get document extracted text (markdown)
   * Directly from the document data
   */
  getDocumentContent: async (id) => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid document ID');
    }
    
    try {
      const response = await api.get(`/documents/${id}/`);
      console.log('Checking document for content:', response.data);
      
      // Check all potential field names where content might be stored
      const content = 
        response.data.extracted_text || 
        response.data.content || 
        response.data.parsed_content || 
        '';
      
      console.log('Extracted content length:', content?.length || 0);
      console.log('Content preview:', content?.substring(0, 100));
      
      return content;
    } catch (error) {
      console.error(`Error fetching document content for ${id}:`, error);
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
      const response = await api.post('/documents/', formData, {
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
   * Get document image
   * @param {string} id - Document ID
   * @returns {Promise} - Promise resolving to document image
   */
  getDocumentImage: async (id) => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid document ID');
    }
    
    try {
      // First try to get the image directly from the document data
      const docResponse = await api.get(`/documents/${id}/`);
      if (docResponse.data && docResponse.data.image_base64) {
        return docResponse.data.image_base64;
      }
      
      // If not available, try a dedicated endpoint
      try {
        const response = await api.get(`/documents/${id}/file/`);
        return response.data.image || '';
      } catch (imageError) {
        console.error(`Error fetching document image for ${id}:`, imageError);
        return '';
      }
    } catch (error) {
      console.error(`Error fetching document for ${id}:`, error);
      throw error;
    }
  }
};

export default documentService;