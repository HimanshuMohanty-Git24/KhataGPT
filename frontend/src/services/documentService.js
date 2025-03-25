import api from './api';

const transformDocument = (doc) => {
  if (!doc) return null;
  
  // Map the doc_type to status - all valid document types should be considered "processed"
  let status = doc.status || "unknown";
  if (doc.doc_type && doc.doc_type !== "unknown" && !status) {
    status = "processed";
  }
  
  return {
    id: doc._id || doc.id,
    filename: doc.title || doc.filename || 'Unnamed document',
    status: status,
    doc_type: doc.doc_type || "unknown",
    uploaded_at: doc.created_at || doc.uploaded_at,
    file_size: doc.file_size || doc.size,
    extracted_text: doc.extracted_text || doc.content || '', // Make sure we get all possible content fields
    image_base64: doc.image_base64 || ''
  };
};

export const documentService = {
  /**
   * Get all documents or search for documents
   * @param {string} searchQuery - Optional search query
   * @returns {Promise<Array>} - Promise resolving to array of documents
   */
  getAllDocuments: async (searchQuery = "") => {
    try {
      // Make sure URL has correct leading slash
      let url = '/documents';
      
      // Add search query parameter if provided
      if (searchQuery && searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery.trim())}`;
      }
      
      console.log('Fetching documents from:', `${api.defaults.baseURL}${url}`);
      const response = await api.get(url);
      
      // Log detailed info about what we received
      console.log('Documents API response:', response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('First document sample:', {
          id: response.data[0]._id,
          title: response.data[0].title || response.data[0].filename,
          hasExtractedText: !!response.data[0].extracted_text,
          extractedTextLength: response.data[0].extracted_text?.length || 0
        });
      }
      
      // Process the response
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
  
  // Other methods with fixed API path formats
  getDocumentById: async (id) => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid document ID');
    }
    
    try {
      // Fix: Use the correct API endpoint path without trailing slash
      const response = await api.get(`/documents/${id}`);
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
      // FIX: Remove the incorrect /api prefix
      const response = await api.get(`/documents/${id}`);
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
      // FIX: Remove the incorrect /api prefix
      const response = await api.post('/documents', formData, {
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
   * @returns {Promise} - Promise resolving to delete result
   */
  deleteDocument: async (id) => {
    try {
      // FIX: Remove the incorrect /api prefix
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get document image
   * @param {string} id - Document ID
   * @returns {Promise<string>} - Promise resolving to base64 image
   */
  getDocumentImage: async (id) => {
    try {
      const doc = await documentService.getDocumentById(id);
      
      // Use image_base64 directly from the document if available
      if (doc && doc.image_base64) {
        return doc.image_base64;
      }
      
      // Otherwise, try to fetch the image separately
      try {
        // FIX: Remove the incorrect /api prefix
        const response = await api.get(`/documents/${id}/file`);
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