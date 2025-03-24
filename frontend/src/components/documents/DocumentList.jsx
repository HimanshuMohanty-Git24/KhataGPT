import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Chip,
  Box,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import documentService from '../../services/documentService';

const getDocTypeIcon = (docType) => {
  switch (docType) {
    case 'receipt':
      return <ReceiptIcon />;
    case 'menu':
      return <MenuBookIcon />;
    case 'form':
      return <FormatListBulletedIcon />;
    default:
      return <DescriptionIcon />;
  }
};

const DocumentList = ({ documents, onDeleteDocument }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [documentToDelete, setDocumentToDelete] = React.useState(null);

  const handleViewDocument = (documentId) => {
    navigate(`/documents/${documentId}`);
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      onDeleteDocument(documentToDelete._id);
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  if (!documents.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No documents found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/documents/new')}
          sx={{ mt: 2 }}
        >
          Upload your first document
        </Button>
      </Box>
    );
  }

  return (
    <>
      <List>
        {documents.map((document) => (
          <Paper 
            key={document._id} 
            elevation={1}
            sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}
          >
            <ListItem 
              button 
              onClick={() => handleViewDocument(document._id)}
              sx={{ 
                borderLeft: '4px solid',
                borderLeftColor: document.doc_type === 'receipt' ? 'success.main' : 
                                  document.doc_type === 'menu' ? 'info.main' : 
                                  document.doc_type === 'form' ? 'warning.main' : 'primary.main'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  {getDocTypeIcon(document.doc_type)}
                </Grid>
                <Grid item xs>
                  <ListItemText
                    primary={document.title}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" component="span">
                          {documentService.formatDate(document.created_at)}
                        </Typography>
                        {document.chat_count > 0 && (
                          <Chip 
                            icon={<ChatIcon fontSize="small" />} 
                            label={`${document.chat_count} chats`}
                            size="small" 
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    }
                  />
                </Grid>
                <Grid item>
                  <Chip 
                    label={documentService.getDocTypeLabel(document.doc_type)} 
                    color={document.doc_type === 'receipt' ? 'success' : 
                           document.doc_type === 'menu' ? 'info' : 
                           document.doc_type === 'form' ? 'warning' : 'primary'}
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(document);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </Grid>
              </Grid>
            </ListItem>
          </Paper>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{documentToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentList;