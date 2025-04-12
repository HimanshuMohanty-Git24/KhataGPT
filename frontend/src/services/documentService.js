import api from "./api";

const transformDocument = (doc) => {
  // The backend stores date in 'created_at', but frontend uses 'uploaded_at'
  let uploadDate = doc.uploaded_at || doc.created_at;
  
  if (!uploadDate) {
    console.warn(`Document ${doc._id || doc.id} missing date information, using fallback`);
    uploadDate = new Date().toISOString();
  } else if (typeof uploadDate === 'string' && !isNaN(Date.parse(uploadDate))) {
    // Just parse it to ensure valid format, but don't create a new date object
    // which would reset to current time
    uploadDate = new Date(uploadDate).toISOString();
  } else if (uploadDate instanceof Date) {
    // If it's already a Date object, convert to ISO string
    uploadDate = uploadDate.toISOString();
  }
  
  return {
    id: doc._id || doc.id,
    filename: doc.title || doc.filename || "Untitled Document",
    doc_type: doc.doc_type || "unknown",
    status: doc.status || "unknown",
    uploaded_at: uploadDate,  // Map created_at to uploaded_at
    extracted_text: doc.extracted_text || "",
    image_base64: doc.image_base64 || "",
    file_type: doc.file_type || "image",
    file_size: doc.file_size || 0,
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
      let url = "/documents";

      // Add search query parameter if provided
      if (searchQuery && searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery.trim())}`;
      }

      console.log("Fetching documents from:", `${api.defaults.baseURL}${url}`);
      const response = await api.get(url);

      // Log detailed info about what we received
      console.log("Documents API response:", response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log("First document sample:", {
          id: response.data[0]._id,
          title: response.data[0].title || response.data[0].filename,
          hasExtractedText: !!response.data[0].extracted_text,
          extractedTextLength: response.data[0].extracted_text?.length || 0,
        });
      }
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log("First document date fields:", {
          created_at: response.data[0].created_at,
          uploaded_at: response.data[0].uploaded_at,
          transformed: transformDocument(response.data[0]).uploaded_at
        });
      }

      // Process the response
      if (Array.isArray(response.data)) {
        return response.data.map(transformDocument);
      } else if (response.data && Array.isArray(response.data.documents)) {
        return response.data.documents.map(transformDocument);
      } else {
        console.warn("Unexpected data format for documents:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  // Other methods with fixed API path formats
  getDocumentById: async (id) => {
    if (!id || id === "undefined") {
      throw new Error("Invalid document ID");
    }

    try {
      // Fix: Use the correct API endpoint path without trailing slash
      const response = await api.get(`/documents/${id}`);
      console.log("Full document data:", response.data);
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
    if (!id || id === "undefined") {
      throw new Error("Invalid document ID");
    }

    try {
      // FIX: Remove the incorrect /api prefix
      const response = await api.get(`/documents/${id}`);
      console.log("Checking document for content:", response.data);

      // Check all potential field names where content might be stored
      const content =
        response.data.extracted_text ||
        response.data.content ||
        response.data.parsed_content ||
        "";

      console.log("Extracted content length:", content?.length || 0);
      console.log("Content preview:", content?.substring(0, 100));

      return content;
    } catch (error) {
      console.error(`Error fetching document content for ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update document content (markdown)
   * @param {string} id - Document ID
   * @param {string} content - New content in markdown format
   * @returns {Promise<Object>} - Promise resolving to update result
   */
  updateDocumentContent: async (id, content) => {
    if (!id || id === "undefined") {
      throw new Error("Invalid document ID");
    }

    try {
      console.log(
        `Updating content for document ${id}, content length: ${content.length}`
      );
      const response = await api.put(`/documents/${id}/content`, {
        content: content,
      });

      console.log("Update content response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating document content for ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update document title
   * @param {string} id - Document ID
   * @param {string} title - New document title
   * @returns {Promise<Object>} - Promise resolving to update result
   */
  updateDocumentTitle: async (id, title) => {
    if (!id || id === "undefined") {
      throw new Error("Invalid document ID");
    }

    try {
      console.log(`Updating title for document ${id} to: ${title}`);
      const response = await api.put(`/documents/${id}/title`, {
        title: title,
      });

      console.log("Update title response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating document title for ${id}:`, error);
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
      const response = await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
      console.error("Error uploading documents:", error);
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
        const response = await api.get(`/documents/${id}/file`);
        return response.data.image || "";
      } catch (imageError) {
        console.error(`Error fetching document file for ${id}:`, imageError);
        return "";
      }
    } catch (error) {
      console.error(`Error fetching document for ${id}:`, error);
      throw error;
    }
  },

  /**
   * Determine if a document is a PDF
   */
  isPDF: (document) => {
    return document && document.file_type === "pdf";
  },
};

export default documentService;
