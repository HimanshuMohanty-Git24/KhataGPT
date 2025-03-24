import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem,
  Chip,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Helper function to determine icon based on file type
const getFileIcon = (filename = '') => {
  const extension = filename.split('.').pop().toLowerCase();
  
  switch(extension) {
    case 'pdf':
      return <PictureAsPdfIcon sx={{ color: '#E74C3C' }} />;
    case 'doc':
    case 'docx':
      return <DescriptionOutlinedIcon sx={{ color: '#3498DB' }} />;
    case 'txt':
      return <TextSnippetIcon sx={{ color: '#7F8C8D' }} />;
    default:
      return <InsertDriveFileIcon />;
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const DocumentCard = ({ document, onDelete, loading = false }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (onDelete) onDelete(document.id);
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Skeleton loader
  if (loading) {
    return (
      <Card 
        elevation={1}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'visible',
          position: 'relative',
          transition: 'all 0.3s ease',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1, mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" height={24} width={60} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={24} width={60} sx={{ borderRadius: 1 }} />
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Skeleton variant="rectangular" height={36} width={80} sx={{ borderRadius: 1 }} />
          <Box sx={{ flexGrow: 1 }} />
          <Skeleton variant="circular" width={36} height={36} />
        </CardActions>
      </Card>
    );
  }

  // If no document provided, return null
  if (!document) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        elevation={1}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'visible',
          position: 'relative',
          transition: 'all 0.3s ease',
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            boxShadow: theme.shadows[8],
            borderColor: 'transparent',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                mr: 1.5,
                display: 'flex',
                p: 1,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              {getFileIcon(document.filename)}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" noWrap title={document.filename}>
                {truncateText(document.filename, 20)}
              </Typography>
              <Typography 
                variant="caption" 
                color="textSecondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <CalendarTodayIcon fontSize="inherit" />
                {formatDate(document.uploaded_at)}
              </Typography>
            </Box>
          </Box>

          <Typography 
            variant="body2" 
            color="textSecondary" 
            sx={{ 
              mb: 2, 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '40px'
            }}
          >
            {document.description || 'No description available for this document.'}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip 
              size="small" 
              label={document.status}
              color={document.status === 'processed' ? 'success' : document.status === 'processing' ? 'warning' : 'default'}
            />
            {document.file_size && (
              <Chip 
                size="small" 
                label={`${(document.file_size / 1024 / 1024).toFixed(2)} MB`}
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            component={Link}
            to={`/documents/${document.id}`}
            size="small"
            startIcon={<ChatIcon />}
            color="primary"
            variant="contained"
            sx={{ borderRadius: '20px', px: 2 }}
          >
            Chat
          </Button>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Tooltip title="Actions">
            <IconButton 
              aria-label="document actions" 
              onClick={handleMenuOpen}
              size="small"
              sx={{ 
                ml: 1,
                color: theme.palette.text.secondary,
                '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { borderRadius: 2, minWidth: 150 }
            }}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to={`/documents/${document.id}`}>
              <ChatIcon fontSize="small" sx={{ mr: 1 }} />
              Chat
            </MenuItem>
            <MenuItem onClick={handleMenuClose} disabled>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleMenuClose} disabled>
              <FileCopyIcon fontSize="small" sx={{ mr: 1 }} />
              Duplicate
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} sx={{ color: theme.palette.error.main }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </CardActions>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Delete Document
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{document.filename}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default DocumentCard;