/**
 * Safely get a nested property in an object without errors
 * @param {Object} obj - The object to get value from
 * @param {string} path - Path to the property, using dot notation
 * @param {*} defaultValue - Value to return if path doesn't exist
 * @returns {*} - The value at path or defaultValue
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
    if (!obj || !path) return defaultValue;
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result === undefined ? defaultValue : result;
  };
  
  /**
   * Debounce a function to prevent rapid calls
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} - Debounced function
   */
  export const debounce = (func, delay) => {
    let timer;
    
    return function(...args) {
      const context = this;
      
      clearTimeout(timer);
      
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };
  
  /**
   * Generate a random string id
   * @param {number} length - Length of the ID
   * @returns {string} - Random ID
   */
  export const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  };
  
  /**
   * Detect file type from mime type or extension
   * @param {string} filename - File name with extension
   * @param {string} mimeType - File MIME type
   * @returns {string} - File type category
   */
  export const getFileType = (filename, mimeType) => {
    // Extract extension from filename
    const extension = filename?.split('.').pop()?.toLowerCase();
    
    // Document types
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'pages'];
    const spreadsheetTypes = ['xls', 'xlsx', 'csv', 'ods', 'numbers'];
    const presentationTypes = ['ppt', 'pptx', 'odp', 'key'];
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    
    // Check by extension
    if (documentTypes.includes(extension)) return 'document';
    if (spreadsheetTypes.includes(extension)) return 'spreadsheet';
    if (presentationTypes.includes(extension)) return 'presentation';
    if (imageTypes.includes(extension)) return 'image';
    
    // Check by MIME type
    if (mimeType) {
      if (mimeType.startsWith('application/pdf')) return 'document';
      if (mimeType.includes('document')) return 'document';
      if (mimeType.includes('sheet') || mimeType.includes('csv')) return 'spreadsheet';
      if (mimeType.includes('presentation')) return 'presentation';
      if (mimeType.startsWith('image/')) return 'image';
    }
    
    // Default
    return 'other';
  };
  
  /**
   * Delay for a specified time (useful with async/await)
   * @param {number} ms - Time to delay in milliseconds
   * @returns {Promise} - Promise that resolves after the delay
   */
  export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  /**
   * Check if a URL is external
   * @param {string} url - URL to check
   * @returns {boolean} - Whether the URL is external
   */
  export const isExternalUrl = (url) => {
    if (!url) return false;
    
    // If it's a relative URL
    if (!url.startsWith('http')) return false;
    
    // Get domain of the URL
    try {
      const urlDomain = new URL(url).hostname;
      const currentDomain = window.location.hostname;
      
      return urlDomain !== currentDomain;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Create a range of numbers
   * @param {number} start - Start number
   * @param {number} end - End number
   * @returns {Array} - Array containing the range
   */
  export const range = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  
  /**
   * Capitalize the first letter of each word in a string
   * @param {string} str - String to capitalize
   * @returns {string} - Capitalized string
   */
  export const capitalize = (str) => {
    if (!str) return '';
    
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  /**
   * Safely parse JSON without throwing errors
   * @param {string} jsonString - JSON string to parse
   * @param {*} fallback - Value to return if parsing fails
   * @returns {Object|*} - Parsed object or fallback
   */
  export const safeJsonParse = (jsonString, fallback = {}) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return fallback;
    }
  };