import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  LinearProgress, 
  Alert,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import documentService from '../../services/documentService';

const DocumentUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, or WEBP)');
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);

      const uploadedDocument = await documentService.uploadDocument(selectedFile);
      
      // Navigate to document view page
      navigate(`/documents/${uploadedDocument._id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || 'Error uploading document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Upload Document
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="document-upload"
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label htmlFor="document-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
            fullWidth
            sx={{ p: 2, border: '2px dashed #ccc' }}
          >
            Select Document Image
          </Button>
        </label>
      </Box>
      
      {selectedFile && (
        <Box sx={{ mt: 2, position: 'relative' }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected: {selectedFile.name}
          </Typography>
          
          {preview && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={preview}
                alt="Document preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                }}
              />
              
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  bgcolor: 'rgba(255,255,255,0.7)',
                }}
                onClick={handleClearSelection}
                disabled={uploading}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading}
            fullWidth
            sx={{ mt: 1 }}
          >
            {uploading ? 'Processing...' : 'Upload & Process Document'}
          </Button>
          
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Extracting text and analyzing document...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default DocumentUploader;