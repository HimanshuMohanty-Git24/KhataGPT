import React, { useState, useEffect, useMemo } from "react";
// Update to use the standard entry point instead of the webpack-specific one
import { Document, Page } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

// Set worker path - use the legacy build for better compatibility
// Make sure to import pdfjs before setting the worker
import { pdfjs } from 'react-pdf';

// Set the worker source
console.log(`PDF.js version: ${pdfjs.version}`);
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const PDFViewer = ({ pdfData }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  // Create a data URL from the base64 PDF data
  const pdfDataUrl = useMemo(() => {
    if (!pdfData) return null;
    try {
      // Basic check if it looks like base64
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
  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    setPageNumber(1); // Reset to first page on new document load
    setLoading(false);
    setError(null); // Clear previous errors
    console.log(`PDF loaded successfully with ${nextNumPages} pages.`);
  };

  // Error handling function for document loading
  const onDocumentLoadError = (err) => {
    console.error("Error loading PDF document:", err);
    // Provide more specific error messages if possible
    let message = `Failed to load PDF: ${err.message}`;
    if (err.name === 'InvalidPDFException') {
        message = "Invalid or corrupted PDF file.";
    } else if (err.message?.includes('PasswordException')) {
        message = "Password-protected PDF files are not supported.";
    }
    setError(message);
    setLoading(false);
    setNumPages(null); // Reset pages state
  };

   // Error handling for page rendering
   const onPageLoadError = (err) => {
    console.error(`Error loading page ${pageNumber}:`, err);
    setError(`Error rendering page ${pageNumber}.`);
    // Optionally try to recover or show a placeholder
  };

  // Navigation functions
  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  };

  // Zoom functions
  const zoomIn = () => {
    setScale((prevScale) => {
        const newScale = Math.min(prevScale + 0.2, 3.0); // Increased max zoom
        setRenderKey(prev => prev + 1); // Force re-render
        return newScale;
    });
  };

  const zoomOut = () => {
     setScale((prevScale) => {
        const newScale = Math.max(prevScale - 0.2, 0.3); // Decreased min zoom
        setRenderKey(prev => prev + 1); // Force re-render
        return newScale;
    });
  };

  // Reset state when pdfData changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setNumPages(null);
    setPageNumber(1);
    setScale(1.0);
    setRenderKey(0); // Reset render key
  }, [pdfData]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "600px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#333' : '#f7f7f7',
      }}
    >
      {/* Loading Indicator */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 10
          }}
        >
          <CircularProgress />
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
            p: 2,
            zIndex: 9
          }}
        >
            <Alert severity="error" sx={{ width: "100%", maxWidth: "600px" }}>
            {error}
            </Alert>
        </Box>
      )}

      {/* PDF Document Area */}
      {pdfDataUrl && !error && (
         <Box sx={{ width: '100%', flexGrow: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', pt: 2 }}>
            <Document
                key={pdfDataUrl}
                file={pdfDataUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<span />}
                error={<span />}
                options={{
                    cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
                    cMapPacked: true,
                }}
            >
                {numPages && (
                    <Page
                        key={`${pageNumber}-${renderKey}`}
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        onRenderError={onPageLoadError}
                        loading={<CircularProgress size={30} sx={{mt: 4}} />}
                        error={<Typography color="error" sx={{mt: 4}}>Error loading page.</Typography>}
                        width={Math.min(window.innerWidth * 0.8, 800)}
                    />
                )}
            </Document>
        </Box>
      )}

      {/* Controls */}
      {!loading && !error && numPages && numPages > 0 && (
        <Paper
            elevation={2}
            sx={{
                mt: 2,
                p: 1,
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                position: 'sticky',
                bottom: 16,
                zIndex: 5,
                display: 'inline-block',
            }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={zoomOut} disabled={scale <= 0.3} size="small">
              <ZoomOutIcon />
            </IconButton>
             <Typography variant="caption" sx={{ minWidth: '40px', textAlign: 'center' }}>
                {Math.round(scale * 100)}%
            </Typography>
            <IconButton onClick={zoomIn} disabled={scale >= 3.0} size="small">
              <ZoomInIcon />
            </IconButton>

            <Box sx={{ borderLeft: 1, borderColor: 'divider', mx: 1, height: '24px' }} />

            <IconButton onClick={goToPrevPage} disabled={pageNumber <= 1} size="small">
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: '50px', textAlign: 'center' }}>
              {pageNumber} / {numPages}
            </Typography>
            <IconButton onClick={goToNextPage} disabled={pageNumber >= numPages} size="small">
              <NavigateNextIcon />
            </IconButton>
          </Stack>
        </Paper>
      )}
    </Paper>
  );
};

export default PDFViewer;