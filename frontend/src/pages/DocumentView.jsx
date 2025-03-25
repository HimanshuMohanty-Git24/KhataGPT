import React, { useState, useEffect } from "react";
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
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ChatInterface from "../components/chat/ChatInterface";
import { documentService } from "../services/documentService";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
          setMarkdownContent(doc.extracted_text);
        } else {
          // Try fetching content separately
          try {
            const content = await documentService.getDocumentContent(id);
            console.log(
              "Content fetched separately:",
              content?.substring(0, 100)
            );

            if (content && content.trim()) {
              // If we got content, use it
              setMarkdownContent(content);
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
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError("Failed to delete document. Please try again.");
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Function to get the document image URL
  const getDocumentImage = async () => {
    if (!document || !document.id) return null;

    try {
      // Check if we already have the image in the document
      if (document.image_base64) {
        return document.image_base64.startsWith("data:")
          ? document.image_base64
          : `data:image/jpeg;base64,${document.image_base64}`;
      }

      // If not, try to fetch it
      const imageData = await documentService.getDocumentImage(document.id);
      if (imageData) {
        return imageData.startsWith("data:")
          ? imageData
          : `data:image/jpeg;base64,${imageData}`;
      }

      return null;
    } catch (error) {
      console.error("Error getting document image:", error);
      return null;
    }
  };

  // Render loading skeleton
  if (loading) {
    return (
      <>
        <Header />
        <Box
          component='main'
          sx={{
            minHeight: "calc(100vh - 64px)", // Subtract header height
            pt: { xs: 3, sm: 4 }, // Reduced top padding
            pb: 6,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth='lg'>
            <Box sx={{ mb: 4 }}>
              <Skeleton variant='text' width={150} height={40} />
              <Skeleton variant='text' width={250} height={30} />
            </Box>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Skeleton variant='circular' width={50} height={50} />
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Skeleton variant='text' width='60%' height={32} />
                  <Skeleton variant='text' width='40%' height={24} />
                </Box>
                <Skeleton
                  variant='rectangular'
                  width={120}
                  height={40}
                  sx={{ borderRadius: 1 }}
                />
              </Box>

              <Skeleton
                variant='rectangular'
                height={400}
                sx={{ borderRadius: 1, mb: 3 }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Skeleton
                  variant='rectangular'
                  width={100}
                  height={36}
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  variant='rectangular'
                  width={100}
                  height={36}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Paper>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <Header />
        <Box
          component='main'
          sx={{
            minHeight: "100vh",
            pt: 12,
            pb: 8,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth='lg'>
            <Alert
              severity='error'
              variant='filled'
              sx={{ mb: 4, borderRadius: 2 }}
            >
              {error}
            </Alert>

            <Box sx={{ textAlign: "center", mt: 8 }}>
              <Button
                component={Link}
                to='/documents'
                startIcon={<ArrowBackIcon />}
                variant='outlined'
                color='primary'
                size='large'
              >
                Back to Documents
              </Button>
            </Box>
          </Container>
        </Box>
        <Footer />
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
            minHeight: "100vh",
            pt: 12,
            pb: 8,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth='lg'>
            <Alert
              severity='warning'
              variant='filled'
              sx={{ mb: 4, borderRadius: 2 }}
            >
              Document not found
            </Alert>

            <Box sx={{ textAlign: "center", mt: 8 }}>
              <Button
                component={Link}
                to='/documents'
                startIcon={<ArrowBackIcon />}
                variant='outlined'
                color='primary'
                size='large'
              >
                Back to Documents
              </Button>
            </Box>
          </Container>
        </Box>
        <Footer />
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
          minHeight: "100vh",
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
                  {/* <Chip
                    label={document.status || "unknown"}
                    color={
                      document.status === "processed" ||
                      (document.doc_type && document.doc_type !== "unknown")
                        ? "success"
                        : document.status === "processing"
                        ? "warning"
                        : "default"
                    }
                    size='small'
                  /> */}
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
                  icon={<ImageIcon fontSize='small' />}
                  iconPosition='start'
                  label={isMobile ? "" : "Document Image"}
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
                      {markdownContent ? (
                        <Box
                          className='markdown-content'
                          sx={{
                            "& h1": {
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
                                  : alpha(theme.palette.common.black, 0.05),
                            },
                          }}
                        >
                          <ReactMarkdown
                            children={markdownContent}
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
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    children={String(children).replace(
                                      /\n$/,
                                      ""
                                    )}
                                    style={materialDark}
                                    language={match[1]}
                                    PreTag='div'
                                    {...props}
                                  />
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          />
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
                            : "Document processing failed"}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {document.status === "processing"
                            ? "Chat will be available once document processing is complete. This might take a few minutes."
                            : "There was an error processing this document. Please try uploading it again."}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Document Image Tab */}
                {tabValue === 2 && (
                  <Box
                    role='tabpanel'
                    id='document-tabpanel-2'
                    aria-labelledby='document-tab-2'
                    sx={{
                      p: 2, // Reduced padding
                      minHeight: "350px", // Reduced minimum height
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {loading ? (
                      <CircularProgress />
                    ) : imageError ? (
                      <Box sx={{ textAlign: "center", p: 4 }}>
                        <Typography variant='h6' gutterBottom color='error'>
                          Unable to load document image
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          The original document image could not be loaded. This
                          may be because the file is no longer available or
                          requires authentication.
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <Tooltip title='Click to enlarge'>
                          <Box
                            sx={{
                              cursor: "zoom-in",
                              display: "inline-block",
                              position: "relative",
                            }}
                          >
                            <ImageDisplay
                              document={document}
                              onError={() => setImageError(true)}
                              enableZoom={true}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                bgcolor: alpha(
                                  theme.palette.background.paper,
                                  0.7
                                ),
                                borderRadius: "50%",
                                p: 0.5,
                                opacity: 0.8,
                                transition: "opacity 0.2s ease",
                                "&:hover": {
                                  opacity: 1,
                                },
                              }}
                            >
                              <ZoomInIcon fontSize='small' color='primary' />
                            </Box>
                          </Box>
                        </Tooltip>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ mt: 2, display: "block" }}
                        >
                          Click on the image to view in full screen
                        </Typography>
                      </Box>
                    )}
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
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDelete} color='error' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Footer /> */}
    </>
  );
};

const ImageDisplay = ({ document, onError, enableZoom = false }) => {
  const theme = useTheme();
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [openZoom, setOpenZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);

        // First check if document already has base64 image
        if (document.image_base64) {
          const src = document.image_base64.startsWith("data:")
            ? document.image_base64
            : `data:image/jpeg;base64,${document.image_base64}`;
          setImageSrc(src);
          setLoading(false);
          return;
        }

        // If not, try to get it from the API
        const imageData = await documentService.getDocumentImage(document.id);
        if (imageData) {
          const src = imageData.startsWith("data:")
            ? imageData
            : `data:image/jpeg;base64,${imageData}`;
          setImageSrc(src);
        } else {
          // If we can't get the image data, set error
          onError();
        }
      } catch (error) {
        console.error("Error loading document image:", error);
        onError();
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [document, onError]);

  const handleOpenZoom = () => {
    setOpenZoom(true);
    setZoomLevel(1); // Reset zoom when opening
  };

  const handleCloseZoom = () => {
    setOpenZoom(false);
  };

  const zoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!imageSrc) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant='h6' gutterBottom color='error'>
          Unable to load document image
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          The original document image could not be loaded.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        component='img'
        src={imageSrc}
        alt={document.filename}
        onClick={enableZoom ? handleOpenZoom : undefined}
        onError={() => onError()}
        sx={{
          maxWidth: "100%",
          width: "auto",
          height: "auto",
          maxHeight: "calc(100vh - 300px)",
          minHeight: "300px",
          objectFit: "contain",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          boxShadow: theme.shadows[2],
          cursor: enableZoom ? "pointer" : "default",
          transition: "transform 0.2s ease",
          "&:hover": enableZoom
            ? {
                transform: "scale(1.02)",
              }
            : {},
        }}
      />

      {/* Full-screen image modal */}
      {enableZoom && (
        <Modal
          open={openZoom}
          onClose={handleCloseZoom}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: alpha(theme.palette.common.black, 0.9) },
          }}
        >
          <Fade in={openZoom}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {/* Controls toolbar */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  display: "flex",
                  gap: 1,
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: "blur(5px)",
                  borderRadius: 2,
                  p: 0.5,
                }}
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
    </>
  );
};

export default DocumentView;
