import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactMarkdown from "react-markdown";
import documentService from "../services/documentService";
import ChatInterface from "../components/chat/ChatInterface";
import DocumentUploader from "../components/documents/DocumentUploader";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

const DocumentView = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Skip fetching if we're in upload mode
    if (documentId === "new") return;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await documentService.getDocumentById(documentId);
        setDocument(data);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  // If documentId is 'new', we're in upload mode - render DocumentUploader directly
  if (documentId === "new") {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/documents")}
          >
            Back to Documents
          </Button>
        </Box>
        <Typography variant='h4' component='h1' gutterBottom>
          Upload New Document
        </Typography>
        <DocumentUploader />
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDeleteDocument = async () => {
    try {
      await documentService.deleteDocument(documentId);
      navigate("/documents", {
        state: { message: "Document deleted successfully" },
      });
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Failed to delete document. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container maxWidth='md' sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/documents")}
        >
          Back to Documents
        </Button>
      </Container>
    );
  }

  if (!document) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Alert severity='warning'>Document not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/documents")}
          sx={{ mt: 2 }}
        >
          Back to Documents
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/documents")}
        >
          Back to Documents
        </Button>

        <Tooltip title='Delete document'>
          <IconButton color='error' onClick={() => setDeleteDialogOpen(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant='h4' component='h1' gutterBottom>
        {document.title}
      </Typography>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Chip
          label={documentService.getDocTypeLabel(document.doc_type)}
          color='primary'
        />
        <Typography variant='body2' color='text.secondary'>
          Created: {documentService.formatDate(document.created_at)}
        </Typography>
        {document.chat_count > 0 && (
          <Typography variant='body2' color='text.secondary'>
            • {document.chat_count} chat messages
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ height: "100%", overflow: "hidden" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant='fullWidth'
            >
              <Tab label='Extracted Text' />
              <Tab label='Original Image' />
            </Tabs>

            <Box sx={{ p: 3, height: "calc(100% - 48px)", overflow: "auto" }}>
              {activeTab === 0 ? (
                <Box className='markdown-content'>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      // Add custom components for better rendering
                      table: ({ node, ...props }) => (
                        <Paper
                          elevation={0}
                          sx={{ overflow: "hidden", mb: 2, width: "100%" }}
                        >
                          <table
                            {...props}
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
                          />
                        </Paper>
                      ),
                      th: ({ node, ...props }) => (
                        <th
                          {...props}
                          style={{
                            backgroundColor: "#f5f7fa",
                            fontWeight: "bold",
                            padding: "10px 12px",
                            border: "1px solid #e0e0e0",
                            textAlign: "left",
                          }}
                        />
                      ),
                      td: ({ node, ...props }) => (
                        <td
                          {...props}
                          style={{
                            padding: "10px 12px",
                            border: "1px solid #e0e0e0",
                          }}
                        />
                      ),
                      // Enhance headings with Material UI
                      h1: ({ node, ...props }) => (
                        <Typography
                          variant='h4'
                          color='primary'
                          gutterBottom
                          sx={{
                            mt: 2,
                            pt: 1,
                            borderBottom: "1px solid #eaeaea",
                          }}
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <Typography
                          variant='h5'
                          gutterBottom
                          sx={{ mt: 2 }}
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <Typography
                          variant='h6'
                          gutterBottom
                          sx={{ mt: 1.5 }}
                          {...props}
                        />
                      ),
                      // Make links open in new tab
                      a: ({ node, children, ...props }) => (
                        <a target='_blank' rel='noopener noreferrer' {...props}>
                          {children}
                        </a>
                      ),
                      // Format lists better
                      ul: ({ node, ...props }) => (
                        <Box component='ul' sx={{ pl: 2, my: 1 }} {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <Box component='ol' sx={{ pl: 2, my: 1 }} {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <Box component='li' sx={{ my: 0.5 }} {...props} />
                      ),
                    }}
                  >
                    {document.extracted_text}
                  </ReactMarkdown>
                </Box>
              ) : (
                // Image view remains the same
                <Box sx={{ textAlign: "center" }}>
                  {document.image_base64 ? (
                    <img
                      src={`data:image/jpeg;base64,${document.image_base64}`}
                      alt={document.title}
                      style={{ maxWidth: "100%", maxHeight: "70vh" }}
                    />
                  ) : (
                    <Typography color='text.secondary'>
                      No image available
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <ChatInterface
            documentId={documentId}
            documentTitle={document.title}
          />
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{document.title}"? This will also
            delete all associated chat history.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteDocument} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentView;
