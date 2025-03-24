import api from './api';

const CHAT_ENDPOINT = '/api/v1/chat';

const chatService = {
  /**
   * Get chat history for a document
   * @param {string} documentId - Document ID
   * @returns {Promise<Array>} Chat messages
   */
  getChatHistory: async (documentId) => {
    const response = await api.get(`${CHAT_ENDPOINT}/${documentId}`);
    return response.data;
  },
  
  /**
   * Send a chat message
   * @param {string} documentId - Document ID
   * @param {string} message - User message
   * @returns {Promise<Object>} AI response
   */
  sendMessage: async (documentId, message) => {
    const response = await api.post(CHAT_ENDPOINT, {
      document_id: documentId,
      user_message: message,
      // AI response will be filled by the backend
      ai_response: '',
    });
    return response.data;
  },
  
  /**
   * Delete chat history for a document
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Success message
   */
  clearChatHistory: async (documentId) => {
    const response = await api.delete(`${CHAT_ENDPOINT}/${documentId}`);
    return response.data;
  },
  
  /**
   * Format timestamp for display
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Formatted time
   */
  formatTime: (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};

export default chatService;