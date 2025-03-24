import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ListAltIcon from '@mui/icons-material/ListAlt';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          KathaGPT
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Document Analysis with AI
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/documents/new" 
            startIcon={<UploadFileIcon />}
            size="large"
          >
            Upload Document
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/documents" 
            startIcon={<ListAltIcon />}
            size="large"
          >
            View Documents
          </Button>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">
              How It Works
            </Typography>
            <Box component="ul" sx={{ textAlign: 'left' }}>
              <li>Upload images of your documents (receipts, bills, menus, forms, etc.)</li>
              <li>AI analyzes and extracts information automatically</li>
              <li>Ask questions about your documents using chat</li>
              <li>Search across all your documents</li>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;