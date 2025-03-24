/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';
    
    const defaultOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Date(dateString).toLocaleDateString(undefined, mergedOptions);
  };
  
  /**
   * Format a date to include time
   * @param {string} dateString - ISO date string to format
   * @returns {string} - Formatted date and time
   */
  export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Format a timestamp relative to current time (e.g. "5 minutes ago")
   * @param {string} dateString - ISO date string to format
   * @returns {string} - Relative time description
   */
  export const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    // Time units in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    // For future dates
    if (seconds < 0) {
      return 'just now';
    }
    
    // Find the appropriate interval
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      
      if (interval >= 1) {
        return interval === 1 
          ? `1 ${unit} ago` 
          : `${interval} ${unit}s ago`;
      }
    }
    
    return 'just now';
  };
  
  /**
   * Format a file size in bytes to a human-readable format
   * @param {number} bytes - File size in bytes
   * @param {number} decimals - Number of decimal places
   * @returns {string} - Formatted file size with units
   */
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0 || !bytes) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  /**
   * Format a number with thousands separators
   * @param {number} number - The number to format
   * @returns {string} - Formatted number
   */
  export const formatNumber = (number) => {
    if (number === undefined || number === null) return '';
    
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  /**
   * Truncate text with ellipsis if it exceeds max length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncating
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, maxLength) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  };
  
  /**
   * Format a percentage
   * @param {number} value - Value to format as percentage
   * @param {number} decimals - Number of decimal places
   * @returns {string} - Formatted percentage
   */
  export const formatPercentage = (value, decimals = 1) => {
    if (value === undefined || value === null) return '';
    
    return `${value.toFixed(decimals)}%`;
  };