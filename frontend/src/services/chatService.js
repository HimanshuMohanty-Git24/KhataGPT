import api from './api';

/**
 * Service for chat-related API operations
 */
const chatService = {
  /**
   * Send a message to chat with a document
   * @param {string} documentId - ID of the document to chat with
   * @param {string} message - User message
   * @returns {Promise} - Promise resolving to the API response
   */
  sendMessage: async (documentId, message) => {
    try {
      console.log('Sending chat message:', { document_id: documentId, user_message: message });
      
      // Backend expects document_id, user_message AND ai_response
      // We need to send a placeholder for ai_response as the backend model requires it
      // even though the backend will replace it with the actual AI response
      const response = await api.post('/chat/', {
        document_id: documentId,
        user_message: message,
        ai_response: "..." // Placeholder that will be replaced by backend
      });
      
      console.log('Chat response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },
  
  /**
   * Get chat history for a document
   * @param {string} documentId - ID of the document to get chat history for
   * @returns {Promise} - Promise resolving to the API response with chat history
   */
  getChatHistory: async (documentId) => {
    try {
      const response = await api.get(`/chat/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },
  
  /**
   * Clear chat history for a document
   * @param {string} documentId - ID of the document
   * @returns {Promise} - Promise resolving when history is cleared
   */
  clearChatHistory: async (documentId) => {
    try {
      await api.delete(`/chat/${documentId}`);
      return { success: true };
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }
};

export default chatService;