import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const PDFViewer = ({ pdfData }) => {
  const theme = useTheme();
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Memoize the options object to prevent unnecessary rerenders
  const documentOptions = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/standard_fonts/'
  }), []);
  
  // Create a data URL from the base64 PDF data
  const pdfDataUrl = useMemo(() => {
    if (!pdfData) return null;
    try {
      if (typeof pdfData !== 'string' || pdfData.length < 20) {
         throw new Error("Invalid base64 data provided.");
      }
      return `data:application/pdf;base64,${pdfData}`;
    } catch (err) {
      console.error("Error creating PDF data URL:", err);
      setError("Invalid PDF data format.");
      setLoading(false);
      return null;
    }
  }, [pdfData]);

  // Function to handle document load success
  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    setLoading(false);
    setError(null);
    console.log(`PDF loaded successfully with ${nextNumPages} pages.`);
  }, []);

  // Error handling function for document loading
  const onDocumentLoadError = useCallback((err) => {
    console.error("Error loading PDF document:", err);
    let message = `Failed to load PDF: ${err.message || "Unknown error"}`;
    if (err.name === 'InvalidPDFException') {
      message = "Invalid or corrupted PDF file.";
    } else if (err.message?.includes('PasswordException')) {
      message = "Password-protected PDF files are not supported.";
    }
    setError(message);
    setLoading(false);
    setNumPages(null);
  }, []);

  // Error handling for page rendering
  const onPageLoadError = useCallback((err) => {
    console.error(`Error loading page:`, err);
    // Don't set global error for individual page errors
    // as it might prevent other pages from showing
  }, []);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setFullscreen(prev => !prev);
  }, []);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timer;
    if (isHovering) {
      setControlsVisible(true);
      clearTimeout(timer);
    } else {
      timer = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isHovering]);

  // Reset state when pdfData changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setNumPages(null);
    setScale(1.0);
    
    // Clean up any previous PDF.js instances to prevent memory leaks
    return () => {
      // This empty cleanup function ensures proper unmounting
    };
  }, [pdfData]);

  // Generate page components for all pages using Array
  const pageElements = useMemo(() => {
    if (!numPages) return null;
    
    return Array.from(
      new Array(numPages),
      (el, index) => (
        <Box 
          key={`page-${index + 1}`} 
          sx={{ 
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            onLoadError={onPageLoadError}
            loading={
              <Box sx={{ py: 6, px: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={30} />
              </Box>
            }
            error={
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error.main">
                  Error loading page {index + 1}
                </Typography>
              </Box>
            }
            width={Math.min(window.innerWidth * 0.8, 800)}
          />
        </Box>
      )
    );
  }, [numPages, scale, onPageLoadError, theme]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: fullscreen ? '100vh' : '70vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#f7f7f7',
        borderRadius: fullscreen ? 0 : 2,
        transition: 'all 0.3s ease',
        ...(fullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          width: '100%',
          height: '100%',
          borderRadius: 0,
        }),
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={() => {
        setIsHovering(true);
        setControlsVisible(true);
      }}
    >
      {/* Loading Indicator */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: alpha(theme.palette.background.paper, 0.4),
            backdropFilter: "blur(4px)",
            zIndex: 10
          }}
        >
          <CircularProgress size={50} sx={{ mb: 2 }} />
          <Typography variant="body1" color="textSecondary">
            Loading PDF...
          </Typography>
        </Box>
      )}

      {/* Error Display */}
      {!loading && error && (
        <Box
          sx={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            zIndex: 9
          }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              width: "100%", 
              maxWidth: "500px",
              boxShadow: theme.shadows[3],
            }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* PDF Document Area - Scrollable Container for All Pages */}
      <Box 
        sx={{ 
          width: '100%', 
          height: '100%', 
          overflow: 'auto',
          px: { xs: 1, sm: 2, md: 4 },
          py: 3,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.4),
            },
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha(theme.palette.background.paper, 0.1),
            borderRadius: '4px',
          },
        }}
      >
        {pdfDataUrl && !error && (
          <Document
            file={pdfDataUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<span />}
            error={<span />}
            options={documentOptions}
          >
            {pageElements}
          </Document>
        )}
      </Box>

      {/* Floating Controls */}
      <Fade in={controlsVisible}>
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '24px',
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(10px)',
            px: 2.5,
            py: 1.2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            zIndex: 5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
            }
          }}
        >
          <Tooltip title="Zoom out">
            <IconButton onClick={zoomOut} disabled={scale <= 0.5} size="small">
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          
          <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'center', fontWeight: 500 }}>
            {Math.round(scale * 100)}%
          </Typography>
          
          <Tooltip title="Zoom in">
            <IconButton onClick={zoomIn} disabled={scale >= 3.0} size="small">
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reset zoom">
            <IconButton onClick={resetZoom} size="small">
              <RestartAltIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ height: 24, width: 1, backgroundColor: theme.palette.divider, mx: 1 }} />

          <Tooltip title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
            <IconButton onClick={toggleFullscreen} size="small">
              {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Paper>
      </Fade>

      {/* Page count indicator */}
      {numPages && (
        <Fade in={controlsVisible}>
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              borderRadius: '14px',
              backgroundColor: alpha(theme.palette.background.paper, 0.85),
              backdropFilter: 'blur(10px)',
              px: 2,
              py: 0.8,
              zIndex: 5
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {numPages} {numPages === 1 ? 'page' : 'pages'}
            </Typography>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default PDFViewer;