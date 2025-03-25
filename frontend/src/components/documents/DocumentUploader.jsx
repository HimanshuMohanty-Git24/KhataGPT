import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  LinearProgress,
  Alert,
  useTheme,
  alpha,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  Avatar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { documentService } from '../../services/documentService';

const DocumentUploader = ({ onUploadSuccess, refreshDocuments }) => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const cancelTokenRef = useRef();
  const [uploadMethod, setUploadMethod] = useState('upload');
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

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

      // Replace direct axios call with documentService
      await documentService.uploadDocuments(formData, (percentCompleted) => {
        setUploadProgress(percentCompleted);
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
    // Clean up preview URLs
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setError(null);
    setSuccess(false);
  };
  
  const handleRemoveFile = (fileToRemove) => {
    if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleOpenCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access your camera. Please check permissions.');
      setCameraOpen(false);
    }
  };

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    const { videoWidth, videoHeight } = videoRef.current;
    
    // Set canvas dimensions to match video
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    
    // Draw the video frame to the canvas
    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
    
    // Convert canvas to file
    canvasRef.current.toBlob((blob) => {
      const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Add to files list
      setFiles(prevFiles => [
        ...prevFiles,
        Object.assign(capturedFile, {
          preview: URL.createObjectURL(capturedFile),
          progress: 0,
          error: null,
          uploaded: false
        })
      ]);
      
      // Close camera
      handleCloseCamera();
    }, 'image/jpeg');
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
    <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Upload Documents
      </Typography>

      <Tabs
        value={uploadMethod}
        onChange={(e, newValue) => setUploadMethod(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="upload" label="Upload Files" icon={<CloudUploadIcon />} iconPosition="start" />
        <Tab value="camera" label="Take Photo" icon={<CameraAltIcon />} iconPosition="start" />
      </Tabs>

      {uploadMethod === 'upload' ? (
        <Box {...getRootProps()} sx={dropzoneStyle}>
          <input {...getInputProps()} />
          <Box sx={{ py: 4 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
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
      ) : (
        <Box 
          sx={{ 
            p: 3, 
            border: '2px dashed',
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
            textAlign: 'center',
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
          }}
        >
          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            onClick={handleOpenCamera}
            size="large"
            sx={{ py: 1.5 }}
          >
            Open Camera
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 2 }} color="textSecondary">
            Take a photo directly with your device's camera
          </Typography>
        </Box>
      )}
      
      {/* Camera Capture Dialog */}
      <Dialog 
        open={cameraOpen} 
        onClose={handleCloseCamera}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleCloseCamera}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            style={{ 
              width: '100%', 
              maxHeight: '70vh', 
              backgroundColor: '#000' 
            }}
          />
          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCapture}
            startIcon={<CameraAltIcon />}
            sx={{ borderRadius: '50px', px: 3 }}
          >
            Capture Photo
          </Button>
        </DialogActions>
      </Dialog>
      
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files ({files.length})
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 2,
            mt: 2
          }}>
            {files.map((file) => (
              <Card 
                key={file.name}
                elevation={1}
                sx={{
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={file.preview}
                    alt={file.name}
                    sx={{ 
                      height: 140, 
                      objectFit: 'cover',
                      backgroundColor: 'action.hover' 
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%'
                  }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveFile(file)}
                      sx={{ color: 'white' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {file.uploaded && (
                    <Avatar
                      sx={{
                        position: 'absolute',
                        bottom: -12,
                        right: 12,
                        bgcolor: 'success.main',
                        width: 24,
                        height: 24
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                </Box>
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2" noWrap title={file.name}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                  {file.error && (
                    <Typography variant="caption" color="error" display="block">
                      {file.error}
                    </Typography>
                  )}
                </Box>
              </Card>
            ))}
          </Box>

          {uploading && (
            <Box sx={{ width: '100%', mt: 3 }}>
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

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              onClick={uploadFiles}
              disabled={uploading}
              fullWidth
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
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

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Files uploaded successfully!
        </Alert>
      )}
    </Paper>
  );
};

export default DocumentUploader;