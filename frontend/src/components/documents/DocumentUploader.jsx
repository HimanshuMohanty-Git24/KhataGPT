import React, { useState, useCallback, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  LinearProgress,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const DocumentUploader = ({ onUploadSuccess, refreshDocuments }) => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const cancelTokenRef = useRef();

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    setSuccess(false);
    setFiles(
      acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
        progress: 0,
        error: null,
        uploaded: false
      }))
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
      'image/tiff': ['.tiff', '.tif'],
    },
    maxSize: 15728640, // 15MB
    maxFiles: 5,
  });

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(false);

    // Using axios for upload with progress tracking
    cancelTokenRef.current = axios.CancelToken.source();
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file); // Changed from 'files' to 'file' to match backend
      });

      await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: cancelTokenRef.current.token,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setSuccess(true);
      if (refreshDocuments) refreshDocuments();
      if (onUploadSuccess) onUploadSuccess();
      
      // Clear files after successful upload with slight delay to show completion
      setTimeout(() => {
        setFiles([]);
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      if (axios.isCancel(err)) {
        setError('Upload was cancelled');
      } else if (err.response) {
        setError(`Upload failed: ${err.response.data.detail || 'Server error'}`);
      } else {
        setError('Upload failed: Network error or server is unreachable');
      }
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Upload cancelled by user');
    }
    setUploading(false);
  };

  const clearFiles = () => {
    setFiles([]);
    setError(null);
    setSuccess(false);
  };

  const dropzoneStyle = {
    border: '2px dashed',
    borderColor: isDragAccept 
      ? theme.palette.success.main 
      : isDragReject 
        ? theme.palette.error.main 
        : theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    padding: 3,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Upload Images
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Upload receipt, bill, menu, or other document images to analyze and chat with.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Images uploaded successfully!
        </Alert>
      )}
      
      <Box {...getRootProps({ sx: dropzoneStyle })}>
        <input {...getInputProps()} />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <motion.div
            animate={{ y: isDragActive ? -10 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          </motion.div>
          
          <Typography variant="body1" gutterBottom>
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop image files here, or click to select files'}
          </Typography>
          <Typography variant="caption" display="block" color="textSecondary">
            Supports JPG, PNG, GIF, WEBP, HEIC, TIFF (Max: 15MB)
          </Typography>
        </Box>
      </Box>
      
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files ({files.length})
          </Typography>
          
          {files.map((file) => (
            <Box
              key={file.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                mb: 1,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <InsertDriveFileIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </Typography>
              {file.uploaded ? (
                <CheckCircleIcon color="success" sx={{ ml: 1 }} />
              ) : file.error ? (
                <ErrorIcon color="error" sx={{ ml: 1 }} />
              ) : null}
            </Box>
          ))}

          {uploading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              onClick={uploadFiles}
              disabled={uploading}
              fullWidth
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </Button>

            {uploading ? (
              <Button
                variant="outlined"
                color="error"
                onClick={cancelUpload}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={clearFiles}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default DocumentUploader;