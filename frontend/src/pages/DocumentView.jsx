import React, { useState, useEffect, useRef } from "react";
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
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Modal,
  Fade,
  Backdrop,
  Zoom,
  TextField,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ChatIcon from "@mui/icons-material/Chat";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Add PDF icon
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ChatInterface from "../components/chat/ChatInterface";
import PDFViewer from "../components/documents/PDFViewer"; // Import the PDF Viewer
import { documentService } from "../services/documentService";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Import the markdown utilities
import { enhanceMarkdown } from "../utils/markdownUtils";

const DocumentView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");

  // New states for edit functionality
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMarkdown, setEditedMarkdown] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Image viewer states
  const [zoomDialogOpen, setZoomDialogOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageSrc, setImageSrc] = useState("");

  // Fetch document details
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id || id === "undefined") {
        setError("Invalid document ID");
        setLoading(false);
        return;
      }

      try {
        // Fetch the document data
        const doc = await documentService.getDocumentById(id);
        console.log("Fetched document:", doc);
        setDocument(doc);

        // Check if the document has extracted_text directly
        if (doc.extracted_text && doc.extracted_text.trim()) {
          console.log("Using extracted_text directly from document object");
          // Use the enhanceMarkdown utility to ensure consistent formatting
          setMarkdownContent(enhanceMarkdown(doc.extracted_text, doc));
        } else {
          // Try fetching content separately
          try {
            const content = await documentService.getDocumentContent(id);
            console.log(
              "Content fetched separately:",
              content?.substring(0, 100)
            );

            if (content && content.trim()) {
              // If we got content, use it with enhancement
              setMarkdownContent(enhanceMarkdown(content, doc));
            } else {
              // Create a basic fallback for missing content
              createFallbackMarkdown(doc);
            }
          } catch (contentError) {
            console.error("Error fetching document content:", contentError);
            // Set a basic fallback markdown if content fetch fails
            createFallbackMarkdown(doc);
          }
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document. It may have been deleted or moved.");
      } finally {
        setLoading(false);
      }
    };

    // Helper to create fallback markdown when content can't be retrieved
    const createFallbackMarkdown = (doc) => {
      let fallbackContent = `# ${doc.filename || "Document"}\n\n`;
      fallbackContent += `## Document Details\n\n`;
      fallbackContent += `- **Date**: ${new Date(
        doc.uploaded_at || Date.now()
      ).toLocaleDateString()}\n`;
      fallbackContent += `- **Document Type**: ${doc.doc_type || "unknown"}\n`;
      fallbackContent += `- **Status**: ${doc.status || "Unknown"}\n\n`;
      fallbackContent += `Error loading document content. The content may be unavailable or in an unsupported format.`;

      setMarkdownContent(fallbackContent);
    };

    fetchDocument();
  }, [id]);

  // Update editedMarkdown when markdownContent changes and we're not in edit mode
  useEffect(() => {
    if (!isEditMode) {
      setEditedMarkdown(markdownContent);
    }
  }, [markdownContent, isEditMode]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = async () => {
    setDeleteDialogOpen(false);

    try {
      await documentService.deleteDocument(id);
      navigate("/documents", {
        state: { message: "Document deleted successfully" },
      });
    } catch (error) {
      console.error("Failed to delete document:", error);
      setError("Failed to delete document. Please try again later.");
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Handle image zoom modal
  const handleOpenZoom = (src) => {
    setImageSrc(src);
    setZoomLevel(1);
    setZoomDialogOpen(true);
  };

  const handleCloseZoom = () => {
    setZoomDialogOpen(false);
  };

  const zoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  // New handlers for edit functionality
  const handleEditClick = () => {
    setIsEditMode(true);
    setEditedMarkdown(markdownContent);
    setSaveSuccess(false);
  };

  const handleSaveClick = async () => {
    setSaveError(null);
    setIsSaving(true);

    try {
      // Save the updated content to the database
      await documentService.updateDocumentContent(id, editedMarkdown);
      setMarkdownContent(editedMarkdown);
      setIsEditMode(false);
      setSaveSuccess(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save document content:", error);
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedMarkdown(markdownContent);
  };

  const handleMarkdownChange = (e) => {
    setEditedMarkdown(e.target.value);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box
          component='main'
          sx={{
            pt: { xs: 10, sm: 12 },
            pb: 8,
            minHeight: "100vh",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth='lg'>
            <Skeleton variant='text' height={60} width='50%' sx={{ mb: 2 }} />
            <Skeleton variant='rounded' height={500} sx={{ mb: 2 }} />
          </Container>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Box
          component='main'
          sx={{
            pt: { xs: 10, sm: 12 },
            pb: 8,
            minHeight: "100vh",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth='lg'>
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              component={Link}
              to='/documents'
              startIcon={<ArrowBackIcon />}
              variant='contained'
            >
              Back to Documents
            </Button>
          </Container>
        </Box>
      </>
    );
  }

  if (!document) {
    return (
      <>
        <Header />
        <Box
          component='main'
          sx={{
            pt: { xs: 10, sm: 12 },
            pb: 8,
            minHeight: "100vh",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth='lg'>
            <Alert severity='warning' sx={{ mb: 2 }}>
              Document not found or unavailable
            </Alert>
            <Button
              component={Link}
              to='/documents'
              startIcon={<ArrowBackIcon />}
              variant='contained'
            >
              Back to Documents
            </Button>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{document.filename} | KhathaGPT</title>
      </Helmet>
      <Header />
      <Box
        component='main'
        sx={{
          pt: { xs: 10, sm: 12 },
          pb: 8,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth='lg'>
          {/* Breadcrumbs navigation */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'
            sx={{ mb: 2 }}
          >
            <Link
              to='/documents'
              style={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
              }}
            >
              Documents
            </Link>
            <Typography color='text.primary'>{document.filename}</Typography>
          </Breadcrumbs>

          {/* Document header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                mb: 4,
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant='h4'
                  gutterBottom
                  sx={{ fontWeight: 700, lineHeight: 1.2 }}
                >
                  {document.filename}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip
                    icon={<DescriptionIcon fontSize='small' />}
                    label={document.doc_type || "document"}
                    variant='outlined'
                    size='small'
                  />
                  <Typography variant='body2' color='text.secondary'>
                    Uploaded{" "}
                    {document.uploaded_at
                      ? new Date(document.uploaded_at).toLocaleDateString()
                      : "Date unavailable"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title='Back to documents'>
                  <IconButton
                    component={Link}
                    to='/documents'
                    sx={{
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title='Delete document'>
                  <span>
                    <IconButton
                      onClick={handleDeleteClick}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          </motion.div>

          {/* Main content tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                mb: 4,
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    theme.palette.mode === "dark" ? 0.2 : 1
                  ),
                }}
              >
                <Tab
                  icon={<DescriptionIcon fontSize='small' />}
                  iconPosition='start'
                  label={isMobile ? "" : "Preview"}
                  id='document-tab-0'
                  aria-controls='document-tabpanel-0'
                />
                <Tab
                  icon={<ChatIcon fontSize='small' />}
                  iconPosition='start'
                  label={isMobile ? "" : "Chat"}
                  id='document-tab-1'
                  aria-controls='document-tabpanel-1'
                />
                <Tab
                  icon={
                    document?.file_type === "pdf" ? (
                      <PictureAsPdfIcon fontSize='small' />
                    ) : (
                      <ImageIcon fontSize='small' />
                    )
                  }
                  iconPosition='start'
                  label={
                    isMobile
                      ? ""
                      : document?.file_type === "pdf"
                      ? "Document PDF"
                      : "Document Image"
                  }
                  id='document-tab-2'
                  aria-controls='document-tabpanel-2'
                />
              </Tabs>

              <Box sx={{ minHeight: "40vh", position: "relative" }}>
                {/* Preview Tab - Markdown rendered document */}
                {tabValue === 0 && (
                  <Box
                    role='tabpanel'
                    id='document-tabpanel-0'
                    aria-labelledby='document-tab-0'
                    sx={{ p: 2 }} // Reduced padding
                  >
                    {/* Save success message */}
                    {saveSuccess && (
                      <Alert
                        severity='success'
                        sx={{ mb: 2 }}
                        action={
                          <IconButton
                            aria-label='close'
                            color='inherit'
                            size='small'
                            onClick={() => setSaveSuccess(false)}
                          >
                            <CloseIcon fontSize='inherit' />
                          </IconButton>
                        }
                      >
                        Document content saved successfully
                      </Alert>
                    )}

                    {/* Save error message */}
                    {saveError && (
                      <Alert
                        severity='error'
                        sx={{ mb: 2 }}
                        action={
                          <IconButton
                            aria-label='close'
                            color='inherit'
                            size='small'
                            onClick={() => setSaveError(null)}
                          >
                            <CloseIcon fontSize='inherit' />
                          </IconButton>
                        }
                      >
                        {saveError}
                      </Alert>
                    )}

                    {/* Edit/Save/Cancel button row */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      {!isEditMode ? (
                        <Button
                          variant='outlined'
                          color='primary'
                          startIcon={<EditIcon />}
                          onClick={handleEditClick}
                          size='small'
                        >
                          Edit Content
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant='outlined'
                            color='inherit'
                            startIcon={<CancelIcon />}
                            onClick={handleCancelEdit}
                            size='small'
                          >
                            Cancel
                          </Button>
                          <Button
                            variant='contained'
                            color='primary'
                            startIcon={
                              isSaving ? (
                                <CircularProgress size={16} color='inherit' />
                              ) : (
                                <SaveIcon />
                              )
                            }
                            onClick={handleSaveClick}
                            disabled={isSaving}
                            size='small'
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                        </>
                      )}
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          theme.palette.mode === "dark" ? 0.2 : 1
                        ),
                        borderRadius: 2,
                        overflowY: "auto",
                      }}
                    >
                      {isEditMode ? (
                        // Editor mode - TextField for editing markdown
                        <TextField
                          fullWidth
                          multiline
                          value={editedMarkdown}
                          onChange={handleMarkdownChange}
                          variant='outlined'
                          minRows={20}
                          inputProps={{
                            style: {
                              fontFamily: "monospace",
                              fontSize: "0.875rem",
                              lineHeight: "1.5",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? alpha(theme.palette.common.black, 0.2)
                                  : alpha(theme.palette.common.white, 0.8),
                            },
                          }}
                        />
                      ) : // View mode - Rendered markdown
                      markdownContent ? (
                        <Box
                          className='markdown-content'
                          sx={{
                            "& h1": {
                              fontSize: "1.8rem",
                              fontWeight: 700,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              pb: 1,
                              mb: 2,
                              color: theme.palette.primary.main,
                            },
                            "& h2": {
                              mt: 3,
                              mb: 2,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.primary.light
                                  : theme.palette.primary.dark,
                            },
                            "& pre": {
                              borderRadius: 1,
                              p: 2,
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? alpha(theme.palette.common.black, 0.3)
                                  : alpha(theme.palette.common.black, 0.05),
                              overflowX: "auto",
                            },
                            "& table": {
                              borderCollapse: "collapse",
                              width: "100%",
                              mb: 2,
                            },
                            "& th, & td": {
                              border: `1px solid ${theme.palette.divider}`,
                              p: 1.5,
                            },
                            "& th": {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? alpha(theme.palette.common.black, 0.3)
                                  : alpha(theme.palette.primary.main, 0.05),
                            },
                          }}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSanitize, rehypeRaw]}
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                const language = match ? match[1] : "";
                                return !inline ? (
                                  <Box sx={{ position: "relative", mb: 2 }}>
                                    <SyntaxHighlighter
                                      style={
                                        theme.palette.mode === "dark"
                                          ? materialDark
                                          : undefined
                                      }
                                      language={language || "text"}
                                      PreTag='div'
                                      {...props}
                                      wrapLongLines
                                    >
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  </Box>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              // Enhanced table rendering
                              table({ node, ...props }) {
                                return (
                                  <Box sx={{ overflowX: "auto", mb: 2 }}>
                                    <table
                                      style={{
                                        minWidth: "400px",
                                        width: "100%",
                                      }}
                                      {...props}
                                    />
                                  </Box>
                                );
                              },
                              // Better handling of images
                              img({ src, alt, ...props }) {
                                return (
                                  <img
                                    src={src}
                                    alt={alt || "Document image"}
                                    style={{ maxWidth: "100%", height: "auto" }}
                                    {...props}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "/assets/images/image-placeholder.png";
                                    }}
                                  />
                                );
                              },
                              // Better paragraph handling
                              p({ children, ...props }) {
                                return (
                                  <Typography
                                    component='p'
                                    variant='body1'
                                    sx={{ mb: 2, lineHeight: 1.7 }}
                                    {...props}
                                  >
                                    {children}
                                  </Typography>
                                );
                              },
                            }}
                          >
                            {markdownContent}
                          </ReactMarkdown>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant='body1' color='text.secondary'>
                            No preview available for this document.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                )}

                {/* Chat Tab */}
                {tabValue === 1 && (
                  <Box
                    role='tabpanel'
                    id='document-tabpanel-1'
                    aria-labelledby='document-tab-1'
                    sx={{ height: "calc(100vh - 250px)", minHeight: "500px" }}
                  >
                    {document.status === "processed" ||
                    (document.doc_type && document.doc_type !== "unknown") ? (
                      <ChatInterface
                        documentId={document.id}
                        documentName={document.filename}
                        documentContext={{
                          title: document.filename,
                          content: markdownContent,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          height: "100%",
                          p: 3,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant='h6' gutterBottom>
                          {document.status === "processing"
                            ? "Document is still processing..."
                            : "Document needs to be processed"}
                        </Typography>
                        <Typography
                          variant='body1'
                          color='text.secondary'
                          sx={{ mb: 3 }}
                        >
                          {document.status === "processing"
                            ? "Please wait while we extract the content from your document."
                            : "We need to process this document before you can chat with it."}
                        </Typography>
                        {document.status === "processing" ? (
                          <CircularProgress size={40} />
                        ) : (
                          <Button
                            variant='contained'
                            color='primary'
                            startIcon={<DescriptionIcon />}
                          >
                            Process Document
                          </Button>
                        )}
                      </Box>
                    )}
                  </Box>
                )}

                {/* Document Image/PDF Tab */}
                {tabValue === 2 && (
                  <Box
                    role='tabpanel'
                    id='document-tabpanel-2'
                    aria-labelledby='document-tab-2'
                    sx={{ p: 3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        minHeight: "60vh",
                      }}
                    >
                      {document.image_base64 ? (
                        document.file_type === "pdf" ? (
                          // PDF Viewer
                          <PDFViewer pdfData={document.image_base64} />
                        ) : (
                          // Image Viewer (existing code)
                          <Tooltip title='Click to view in full size'>
                            <Box
                              sx={{
                                cursor: "zoom-in",
                                position: "relative",
                                maxWidth: "100%",
                                overflow: "hidden",
                                textAlign: "center",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                },
                              }}
                              onClick={() =>
                                handleOpenZoom(
                                  `data:image/jpeg;base64,${document.image_base64}`
                                )
                              }
                            >
                              <Box
                                component='img'
                                src={`data:image/jpeg;base64,${document.image_base64}`}
                                alt={document.filename}
                                sx={{
                                  maxWidth: "100%",
                                  maxHeight: "70vh",
                                  borderRadius: 1,
                                  boxShadow: theme.shadows[4],
                                }}
                                onError={(e) => {
                                  setImageError(true);
                                  e.target.style.display = "none";
                                }}
                              />
                            </Box>
                          </Tooltip>
                        )
                      ) : (
                        <Typography
                          variant='body1'
                          color='text.secondary'
                          align='center'
                          sx={{ mt: 3 }}
                        >
                          {imageError
                            ? "Error loading document."
                            : "No document available."}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete "{document.filename}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image zoom modal */}
      {document && (
        <Modal
          open={zoomDialogOpen}
          onClose={handleCloseZoom}
          closeAfterTransition
          slots={{
            backdrop: Backdrop,
          }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={zoomDialogOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0, 0, 0, 0.9)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                outline: "none",
              }}
              onClick={handleCloseZoom}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: alpha(theme.palette.background.paper, 0.2),
                  display: "flex",
                  p: 0.5,
                  borderRadius: 1,
                  backdropFilter: "blur(5px)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Tooltip title='Zoom out'>
                  <IconButton onClick={zoomOut} size='small' color='inherit'>
                    <ZoomOutIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Reset zoom'>
                  <IconButton onClick={resetZoom} size='small' color='inherit'>
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Zoom in'>
                  <IconButton onClick={zoomIn} size='small' color='inherit'>
                    <ZoomInIcon />
                  </IconButton>
                </Tooltip>
                <Box sx={{ width: 1, bgcolor: theme.palette.divider }} />
                <Tooltip title='Close'>
                  <IconButton
                    onClick={handleCloseZoom}
                    size='small'
                    color='inherit'
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Document name */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: "blur(5px)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                <Typography variant='body2' fontWeight='medium'>
                  {document.filename}
                </Typography>
              </Box>

              {/* Enlarged image */}
              <Box
                component='img'
                src={imageSrc}
                alt={document.filename}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  objectFit: "contain",
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.2s ease",
                  cursor: "default",
                }}
              />
            </Box>
          </Fade>
        </Modal>
      )}
      {/* PDF zoom modal */}
      {document && document.file_type === "pdf" && (
        <Modal
          open={zoomDialogOpen}
          onClose={handleCloseZoom}
          closeAfterTransition
          slots={{
            backdrop: Backdrop,
          }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={zoomDialogOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "95%",
                height: "95%",
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                borderRadius: 2,
                p: 2,
                boxShadow: 24,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: alpha(theme.palette.background.paper, 0.2),
                  display: "flex",
                  p: 0.5,
                  borderRadius: 1,
                  backdropFilter: "blur(5px)",
                }}
              >
                <Tooltip title='Close'>
                  <IconButton
                    onClick={handleCloseZoom}
                    size='small'
                    color='inherit'
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Document name */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: "blur(5px)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                <Typography variant='body2' fontWeight='medium'>
                  {document.filename}
                </Typography>
              </Box>

              {/* PDF viewer */}
              <Box
                sx={{ width: "100%", height: "100%", overflow: "auto", mt: 4 }}
              >
                <PDFViewer pdfData={document.image_base64} />
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default DocumentView;
