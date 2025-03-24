import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook to fetch and manage documents
 * @returns {Object} - Documents data, loading state, error state, and helper functions
 */
const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'uploaded_at',
    sortDirection: 'desc'
  });

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/documents/');
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single document by ID
  const fetchDocumentById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/documents/${id}/`);
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch document ${id}:`, err);
      setError('Failed to load document details. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a document
  const deleteDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/documents/${id}/`);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      return true;
    } catch (err) {
      console.error(`Failed to delete document ${id}:`, err);
      setError('Failed to delete document. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Apply filters and sorting to documents
  const filteredAndSortedDocuments = documents
    .filter(doc => {
      // Filter by search query
      const matchesSearch = !filters.search || 
        doc.filename.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filter by status
      const matchesStatus = filters.status === 'all' || doc.status === filters.status;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by the selected field
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      // Handle different data types
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return filters.sortDirection === 'asc' ? comparison : -comparison;
      } else if (filters.sortBy === 'uploaded_at') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return filters.sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        return filters.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents: filteredAndSortedDocuments,
    loading,
    error,
    filters,
    updateFilters,
    fetchDocuments,
    fetchDocumentById,
    deleteDocument
  };
};

export default useDocuments;