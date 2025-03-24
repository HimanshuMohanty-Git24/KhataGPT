import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Alert, 
  useTheme, 
  Paper, 
  Button, 
  useMediaQuery 
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import axios from 'axios';
import DocumentUploader from '../components/documents/DocumentUploader';
import DocumentGrid from '../components/documents/DocumentGrid';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Documents = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('uploaded_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch documents on component mount and when refresh is triggered
  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:8000/documents/');
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await axios.delete(`http://localhost:8000/documents/${documentId}/`);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      console.error('Failed to delete document:', err);
      setError('Failed to delete document. Please try again.');
    }
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    // In a real implementation, you might want to trigger a backend search
    // For now, we'll just filter the documents client-side
  };

  const handleSortChange = (value) => {
    if (sortBy === value) {
      // Toggle direction if clicking the same column
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortDirection('desc'); // Default to descending for a new sort column
    }
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  // Filter and sort documents
  const filteredAndSortedDocuments = documents
    .filter(doc => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by the selected column
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      // Handle different data types
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else if (sortBy === 'uploaded_at') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  return (
    <>
      <Helmet>
        <title>Your Documents | KhathaGPT</title>
        <meta name="description" content="Manage your documents, upload new files, and chat with your content using KhathaGPT." />
      </Helmet>

      <Header />
      
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          pt: 12,
          pb: 8,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Documents
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
                Upload, manage, and chat with your documents
              </Typography>
            </motion.div>

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                mb: 4
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{ 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  }
                }}
              >
                <Tab 
                  label="All Documents" 
                  icon={<AssessmentIcon />} 
                  iconPosition="start"
                  sx={{ py: 2 }}
                />
                <Tab 
                  label="Upload" 
                  icon={<CloudUploadIcon />} 
                  iconPosition="start"
                  sx={{ py: 2 }}
                />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DocumentGrid 
                      documents={filteredAndSortedDocuments}
                      loading={loading}
                      onDelete={handleDeleteDocument}
                      onSearch={handleSearchSubmit}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      onSortChange={handleSortChange}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onFilterChange={handleFilterChange}
                      filterStatus={filterStatus}
                    />
                  </motion.div>
                )}
                
                {tabValue === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DocumentUploader 
                      onUploadSuccess={() => {
                        setTabValue(0);
                        refreshDocuments();
                      }}
                      refreshDocuments={refreshDocuments}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Button
                        onClick={() => setTabValue(0)}
                        color="primary"
                        variant="outlined"
                      >
                        Back to Documents
                      </Button>
                    </Box>
                  </motion.div>
                )}
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Documents;