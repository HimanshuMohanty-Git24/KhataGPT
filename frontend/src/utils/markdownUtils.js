/**
 * Utilities for processing and enhancing markdown content
 */

/**
 * Determines if text appears to be valid markdown
 * @param {string} text - Text to analyze
 * @returns {boolean} True if the text appears to be markdown
 */
export const isMarkdownFormatted = (text) => {
    if (!text || typeof text !== 'string') return false;
    
    // Check for markdown patterns
    const markdownPatterns = [
      /^#+ .*$/m,                 // Headers
      /\[.*\]\(.*\)/,             // Links
      /\*\*.*\*\*/,               // Bold
      /\*.*\*/,                   // Italic
      /```[\s\S]*?```/,           // Code blocks
      /`[^`]*`/,                  // Inline code
      /^\s*[-*+]\s+/m,            // Unordered lists
      /^\s*\d+\.\s+/m,            // Ordered lists
      /^\s*>\s+/m,                // Blockquotes
      /\|.*\|.*\|/,               // Tables
      /!\[.*\]\(.*\)/,            // Images
    ];
    
    // If it matches at least 2 markdown patterns, consider it formatted markdown
    return markdownPatterns.filter(pattern => pattern.test(text)).length >= 2;
  };
  
  /**
   * Converts plain text to markdown with intelligent formatting
   * @param {string} text - Raw text to convert to markdown
   * @param {Object} metadata - Document metadata for enhancing content
   * @returns {string} Formatted markdown
   */
  export const convertToMarkdown = (text, metadata = {}) => {
    if (!text) return '';
    
    // Already markdown formatted
    if (isMarkdownFormatted(text)) return text;
    
    let markdown = '';
    
    // Add title from metadata or create from filename
    if (metadata.title || metadata.filename) {
      markdown += `# ${metadata.title || metadata.filename}\n\n`;
    }
    
    // Add metadata section if available
    if (Object.keys(metadata).length > 0) {
      markdown += `## Document Information\n\n`;
      if (metadata.uploaded_at) {
        markdown += `- **Date**: ${new Date(metadata.uploaded_at).toLocaleDateString()}\n`;
      }
      if (metadata.doc_type) {
        markdown += `- **Type**: ${metadata.doc_type}\n`;
      }
      if (metadata.status) {
        markdown += `- **Status**: ${metadata.status}\n`;
      }
      markdown += `\n`;
    }
    
    // Process the actual content
    const lines = text.split('\n');
    
    // Process each line to identify potential headers and structure
    let inCodeBlock = false;
    let consecutiveBlankLines = 0;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        markdown += `${line}\n`;
        return;
      }
      
      // If inside code block, don't modify anything
      if (inCodeBlock) {
        markdown += `${line}\n`;
        return;
      }
      
      // Skip excess blank lines (limit to max 2 consecutive)
      if (trimmedLine === '') {
        consecutiveBlankLines++;
        if (consecutiveBlankLines <= 2) {
          markdown += '\n';
        }
        return;
      } else {
        consecutiveBlankLines = 0;
      }
      
      // Detect and format potential headers (capitalized lines under 80 chars)
      if (trimmedLine.length < 80 && 
          trimmedLine === trimmedLine.toUpperCase() && 
          trimmedLine.length > 3 &&
          !trimmedLine.startsWith('#')) {
        markdown += `\n## ${trimmedLine}\n\n`;
        return;
      }
      
      // Detect potential list items
      if (/^\d+[\.\)]/.test(trimmedLine)) {
        // Already numbered list format
        markdown += `${line}\n`;
        return;
      }
      
      // Regular paragraph content
      markdown += `${line}\n`;
    });
    
    return markdown;
  };
  
  /**
   * Enhances markdown with consistent formatting and structure
   * @param {string} markdown - Markdown content to enhance
   * @param {Object} metadata - Document metadata
   * @returns {string} Enhanced markdown
   */
  export const enhanceMarkdown = (markdown, metadata = {}) => {
    if (!markdown) return '';
    
    // Convert to markdown if it's not already
    const formattedMarkdown = isMarkdownFormatted(markdown) 
      ? markdown 
      : convertToMarkdown(markdown, metadata);
    
    // Ensure the markdown has a title
    if (!formattedMarkdown.startsWith('# ')) {
      return `# ${metadata.filename || 'Document'}\n\n${formattedMarkdown}`;
    }
    
    return formattedMarkdown;
  };