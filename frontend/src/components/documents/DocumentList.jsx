import React, { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  Typography, 
  Divider, 
  Menu, 
  MenuItem, 
  Chip, 
  Tooltip, 
  useTheme, 
  alpha,
  Skeleton,
  ListItemIcon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { getFileType } from '../../utils/helpers';

/**
 * Component for displaying documents in a list format
 */
const DocumentList = ({ 
  documents = [], 
  loading = false, 
  onDelete, 
  onReprocess,
  emptyMessage = "No documents found."
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const handleOpenMenu = (event, document) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };
  
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedDocument(null);
  };
  
  const handleDelete = () => {
    if (selectedDocument && onDelete) {
      onDelete(selectedDocument.id);
    }
    handleCloseMenu();
  };
  
  const handleReprocess = () => {
    if (selectedDocument && onReprocess) {
      onReprocess(selectedDocument.id);
    }
    handleCloseMenu();
  };
  
  const handleOpenDocument = (documentId) => {
    navigate(`/documents/${documentId}`);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getFileTypeIcon = (filename, mimeType) => {
    const fileType = getFileType(filename, mimeType);
    
    switch (fileType) {
      case 'document':
        return <ArticleIcon />;
      case 'pdf':
        return <PictureAsPdfIcon />;
      case 'image':
        return <ImageIcon />;
      case 'spreadsheet':
        return <DescriptionIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };
  
  if (loading) {
    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <React.Fragment key={index}>
            <ListItem
              alignItems="flex-start"
              sx={{ 
                py: 2,
                cursor: 'pointer',
              }}
            >
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton variant="text" width="60%" />}
                secondary={
                  <React.Fragment>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="30%" />
                  </React.Fragment>
                }
              />
              <Skeleton variant="circular" width={40} height={40} />
            </ListItem>
            {index < 4 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    );
  }
  
  if (documents.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }
  
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
      {documents.map((document, index) => (
        <React.Fragment key={document.id || index}>
          <ListItem
            alignItems="flex-start"
            sx={{ 
              py: 2,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              }
            }}
            onClick={() => handleOpenDocument(document.id)}
          >
            <ListItemAvatar>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  color: theme.palette.primary.main 
                }}
              >
                {getFileTypeIcon(document.filename, document.mime_type)}
              </Avatar>
            </ListItemAvatar>
            
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    component="span" 
                    sx={{ 
                      fontWeight: 500,
                      mr: 1,
                      maxWidth: { xs: '180px', sm: '300px', md: '100%' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {document.filename}
                  </Typography>
                  <Chip 
                    label={document.status || 'unknown'}
                    color={getStatusColor(document.status)}
                    size="small"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                  >
                    {formatDate(document.uploaded_at)} • {formatFileSize(document.file_size || 0)}
                    {document.pages && ` • ${document.pages} pages`}
                  </Typography>
                  {document.description && (
                    <Typography
                      component="div"
                      variant="body2"
                      color="textSecondary"
                      sx={{ 
                        mt: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {document.description}
                    </Typography>
                  )}
                </React.Fragment>
              }
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                edge="end" 
                onClick={(e) => handleOpenMenu(e, document)}
                sx={{ color: theme.palette.text.secondary }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </ListItem>
          
          {index < documents.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
      
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 2,
          sx: { minWidth: 180 }
        }}
      >
        <MenuItem 
          onClick={() => {
            handleCloseMenu();
            if (selectedDocument) {
              handleOpenDocument(selectedDocument.id);
            }
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Document</ListItemText>
        </MenuItem>
        
        {onReprocess && (
          <MenuItem onClick={handleReprocess}>
            <ListItemIcon>
              <AutorenewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reprocess</ListItemText>
          </MenuItem>
        )}
        
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </List>
  );
};

export default DocumentList;