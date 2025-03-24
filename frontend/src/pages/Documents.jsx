import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Button,
  Paper,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import DocumentList from '../components/documents/DocumentList';
import DocumentUploader from '../components/documents/DocumentUploader';
import documentService from '../services/documentService';

const Documents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUploadMode = location.pathname.includes('/new');
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState(isUploadMode ? 1 : 0);

  // Check for notification from document deletion or creation
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        severity: location.state.severity || 'success'
      });
      
      // Clear the message after showing it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch documents on load and when search changes
  useEffect(() => {
    const fetchDocuments = async (search = '') => {
      try {
        setLoading(true);
        setError(null);
        
        // Set searching state if there's a search term
        if (search) setSearching(true);
        
        const data = await documentService.getAllDocuments(search);
        setDocuments(data);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again.');
      } finally {
        setLoading(false);
        setSearching(false);
      }
    };

    // Debounce search to prevent too many API calls
    const debounceTimeout = setTimeout(() => {
      fetchDocuments(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await documentService.deleteDocument(documentId);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      setNotification({
        message: 'Document deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting document:', err);
      setNotification({
        message: 'Failed to delete document. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      navigate('/documents');
    } else {
      navigate('/documents/new');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Documents
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="My Documents" />
          <Tab label="Upload New" />
        </Tabs>
      </Paper>
      
      {activeTab === 0 ? (
        /* Documents list view */
        <>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search documents..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={clearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Box>
          
          {loading && !searching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              {searching && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Searching...
                  </Typography>
                </Box>
              )}
              
              <DocumentList 
                documents={documents} 
                onDeleteDocument={handleDeleteDocument}
              />
              
              {documents.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/documents/new')}
                  >
                    Add New Document
                  </Button>
                </Box>
              )}
            </>
          )}
        </>
      ) : (
        /* Upload view */
        <DocumentUploader />
      )}
      
      {/* Notification snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification && (
          <Alert
            onClose={() => setNotification(null)}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
};

export default Documents;