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
      const response = await api.post(`/chat/${documentId}/`, {
        query: message
      });
      
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
      const response = await api.get(`/chat/${documentId}/history/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },
  
  /**
   * Stream a chat response (if supported by the backend)
   * @param {string} documentId - ID of the document to chat with
   * @param {string} message - User message
   * @param {Function} onChunk - Callback function for each chunk of the stream
   * @returns {Promise} - Promise resolving when the stream completes
   */
  streamMessage: async (documentId, message, onChunk) => {
    try {
      // This uses the Fetch API for streaming
      const response = await fetch(`${api.defaults.baseURL}/chat/${documentId}/stream/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers as needed
        },
        body: JSON.stringify({ query: message }),
      });
      
      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the stream reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Read the stream
      let done = false;
      let accumulatedChunks = '';
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (done) break;
        
        // Decode the chunk and process it
        const chunk = decoder.decode(value, { stream: true });
        accumulatedChunks += chunk;
        
        // Process the chunks - may need to adjust depending on your API's streaming format
        // Some APIs send newline-delimited JSON
        try {
          // Try to split by newlines and process each valid JSON object
          const lines = accumulatedChunks.split('\n');
          
          // Process all complete lines except the last one (which might be incomplete)
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line) {
              const parsed = JSON.parse(line);
              onChunk(parsed);
            }
          }
          
          // Keep the last (potentially incomplete) line for the next iteration
          accumulatedChunks = lines[lines.length - 1];
        } catch (e) {
          // If JSON parsing fails, just pass the raw chunk
          onChunk({ text: chunk, type: 'text' });
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error streaming chat message:', error);
      throw error;
    }
  },
  
  /**
   * Generate a title for a new chat
   * @param {string} documentId - ID of the document
   * @returns {Promise} - Promise resolving to the generated title
   */
  generateChatTitle: async (documentId, firstMessage) => {
    try {
      const response = await api.post(`/chat/${documentId}/generate-title/`, {
        message: firstMessage
      });
      
      return response.data.title;
    } catch (error) {
      console.error('Error generating chat title:', error);
      // Return a fallback title instead of throwing
      return `Chat ${new Date().toLocaleString()}`;
    }
  }
};

export default chatService;