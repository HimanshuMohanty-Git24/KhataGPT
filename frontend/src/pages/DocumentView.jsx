import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Tab, 
  Tabs, 
  Button, 
  IconButton, 
  Skeleton, 
  Chip, 
  Tooltip, 
  Alert, 
  Breadcrumbs, 
  useTheme, 
  useMediaQuery,
  alpha
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChatIcon from '@mui/icons-material/Chat';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import ChatInterface from '../components/chat/ChatInterface';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const DocumentView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch document details
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:8000/documents/${id}/`);
        setDocument(response.data);
      } catch (err) {
        console.error('Failed to fetch document:', err);
        setError('Failed to load document. It may have been deleted or you don\'t have permission to access it.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/documents/${id}/`);
      navigate('/documents', { state: { message: 'Document deleted successfully' } });
    } catch (err) {
      console.error('Failed to delete document:', err);
      setError('Failed to delete document. Please try again.');
    }
  };

  // Render loading skeleton
  if (loading) {
    return (
      <>
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
            <Skeleton variant="text" width={300} height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  // Show error if document not found
  if (error) {
    return (
      <>
        <Header />
        <Box
          component="main"
          sx={{
            minHeight: '100vh',
            pt: 12,
            pb: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="md">
            <Paper 
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" gutterBottom>Document Not Found</Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {error}
              </Typography>
              <Button
                component={Link}
                to="/documents"
                variant="contained"
                startIcon={<ArrowBackIcon />}
              >
                Back to Documents
              </Button>
            </Paper>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  // If document is not loaded yet and no error
  if (!document) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{document.filename} | KhathaGPT</title>
        <meta name="description" content={`Chat and interact with ${document.filename}. Extract insights and get answers from your document using AI.`} />
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumbs navigation */}
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />} 
              aria-label="breadcrumb"
              sx={{ mb: 2 }}
            >
              <Link to="/" style={{ textDecoration: 'none', color: theme.palette.text.secondary }}>
                Home
              </Link>
              <Link to="/documents" style={{ textDecoration: 'none', color: theme.palette.text.secondary }}>
                Documents
              </Link>
              <Typography color="text.primary">{document.filename}</Typography>
            </Breadcrumbs>

            {/* Document header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  {document.filename}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Uploaded on {new Date(document.uploaded_at).toLocaleDateString()} • 
                  {document.file_size
                    ? ` ${(document.file_size / 1024 / 1024).toFixed(2)} MB`
                    : ''}
                </Typography>
                <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                  <Chip 
                    label={document.status}
                    color={document.status === 'processed' ? 'success' : document.status === 'processing' ? 'warning' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
                <Button
                  component={Link}
                  to="/documents"
                  startIcon={<ArrowBackIcon />}
                  variant="outlined"
                >
                  Back
                </Button>
                
                <Tooltip title="Download">
                  <IconButton
                    color="primary"
                    disabled
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Share">
                  <IconButton
                    color="primary"
                    disabled
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={handleDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Document status alerts */}
            {document.status === 'processing' && (
              <Alert severity="info" sx={{ mb: 3 }}>
                This document is still being processed. Some features might be limited until processing is complete.
              </Alert>
            )}
            
            {document.status === 'failed' && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Processing of this document failed. Please try uploading again or contact support for assistance.
              </Alert>
            )}

            {/* Document content tabs and display */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    height: '100%',
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InsertDriveFileIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6">Document Details</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      File Name
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {document.filename}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Uploaded
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {new Date(document.uploaded_at).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip 
                      label={document.status}
                      color={document.status === 'processed' ? 'success' : document.status === 'processing' ? 'warning' : 'error'}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      File Size
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {document.file_size
                        ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB`
                        : 'Unknown'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ChatIcon />}
                      onClick={() => setTabValue(0)}
                    >
                      Chat with Document
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange}
                      variant={isMobile ? "fullWidth" : "standard"}
                      sx={{ px: 2 }}
                    >
                      <Tab 
                        icon={<ChatIcon />} 
                        iconPosition="start" 
                        label="Chat" 
                        disabled={document.status !== 'processed'}
                      />
                      <Tab 
                        icon={<DescriptionIcon />} 
                        iconPosition="start" 
                        label="Preview" 
                        disabled={true} // Assuming preview is not implemented yet
                      />
                      <Tab 
                        icon={<InfoIcon />} 
                        iconPosition="start" 
                        label="Analysis" 
                        disabled={true} // Assuming analysis is not implemented yet
                      />
                    </Tabs>
                  </Box>
                  
                  <Box sx={{ p: 0, flexGrow: 1, height: '600px' }}>
                    {tabValue === 0 && (
                      document.status === 'processed' ? (
                        <ChatInterface documentId={document.id} documentName={document.filename} />
                      ) : (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexDirection: 'column',
                            height: '100%',
                            p: 3,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {document.status === 'processing' 
                              ? 'Document is still processing...' 
                              : 'Document processing failed'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {document.status === 'processing' 
                              ? 'Chat will be available once document processing is complete. This might take a few minutes.' 
                              : 'There was an error processing this document. Please try uploading it again.'}
                          </Typography>
                        </Box>
                      )
                    )}
                    
                    {tabValue === 1 && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          height: '100%',
                          p: 3
                        }}
                      >
                        <Typography variant="body1" color="textSecondary">
                          Document preview is not available yet.
                        </Typography>
                      </Box>
                    )}
                    
                    {tabValue === 2 && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          height: '100%',
                          p: 3
                        }}
                      >
                        <Typography variant="body1" color="textSecondary">
                          Document analysis is not available yet.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
      
      <Footer />
    </>
  );
};

export default DocumentView;