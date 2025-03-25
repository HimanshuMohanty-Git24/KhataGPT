import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Alert,
  useTheme,
  Paper,
  Button,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import DocumentUploader from "../components/documents/DocumentUploader";
import DocumentGrid from "../components/documents/DocumentGrid";
import Header from "../components/common/Header";
// Remove this import: import Footer from '../components/common/Footer';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RefreshIcon from "@mui/icons-material/Refresh";
import { documentService } from "../services/documentService";

const Documents = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("uploaded_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch documents on component mount and when refresh is triggered
  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const fetchDocuments = async (searchTerm = searchQuery) => {
    setLoading(true);
    setError(null);
  
    try {
      // Log what we're searching for
      console.log("Searching documents with term:", searchTerm);
      
      // Use the passed parameter instead of the state variable
      const documents = await documentService.getAllDocuments(searchTerm);
      console.log("Fetched documents:", documents);
      
      // Validate if documents have the necessary content fields
      documents.forEach(doc => {
        if (!doc.extracted_text) {
          console.warn(`Document ${doc.id} (${doc.filename}) has no extracted_text field`);
          
          // Log document to help debug the issue
          console.log(`Document details:`, {
            id: doc.id,
            title: doc.filename,
            type: doc.doc_type,
            fields: Object.keys(doc),
            receivedFields: doc
          });
        }
      });
      
      setDocuments(Array.isArray(documents) ? documents : []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to load documents. Please try refreshing the page.");
      setDocuments([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshDocuments = () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteDocument = async (id) => {
    try {
      await documentService.deleteDocument(id);
      // Remove the deleted document from state
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError("Failed to delete document. Please try again.");
    }
  };

  const handleSearchSubmit = (query) => {
  setSearchQuery(query);
  
  // Only make API calls for non-empty searches
  if (query.trim() !== "") {
    fetchDocuments(query);
  } else {
    // If search is cleared, refresh documents to get full list
    refreshDocuments();
  }
};

  const handleSortChange = (value) => {
    if (sortBy === value) {
      // Toggle direction if clicking the same column
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(value);
      setSortDirection("desc"); // Default to descending for a new sort column
    }
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  // Filter and sort documents
  const filteredAndSortedDocuments = documents
    .filter((doc) => {
      // Filter by status only (search is now handled by backend)
      return filterStatus === "all" || doc.status === filterStatus;
    })
    .sort((a, b) => {
      // Sort by the selected column
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";

      // Handle different data types
      if (typeof aValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      } else if (sortBy === "uploaded_at") {
        const aDate = new Date(aValue || 0);
        const bDate = new Date(bValue || 0);
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      } else {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

  return (
    <>
      <Helmet>
        <title>Documents | KathaGPT</title>
      </Helmet>

      <Header />

      <Box
        component="main"
        sx={{
          minHeight: "calc(100vh - 64px)", // Subtract header height
          pt: { xs: 3, sm: 4 }, // Reduced top padding
          pb: 6,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ mb: 1, fontWeight: 700 }}
            >
              Documents
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload, manage, and chat with your documents
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 4, borderRadius: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={refreshDocuments}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.paper
                      : theme.palette.background.default,
                  "& .MuiTabs-indicator": {
                    height: "3px",
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
                <Tab
                  label="All Documents"
                  icon={<AssessmentIcon />}
                  iconPosition="start"
                  sx={{ py: 2 }}
                />
                <Tab
                  label="Upload"
                  icon={<CloudUploadIcon />}
                  iconPosition="start"
                  sx={{ py: 2 }}
                />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {loading && documents.length === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          py: 8,
                        }}
                      >
                        <CircularProgress size={60} sx={{ mb: 4 }} />
                        <Typography variant="h6" color="text.secondary">
                          Loading documents...
                        </Typography>
                      </Box>
                    ) : (
                      <DocumentGrid
                        documents={filteredAndSortedDocuments}
                        loading={loading}
                        onDelete={handleDeleteDocument}
                        onSearch={handleSearchSubmit}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSortChange={handleSortChange}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onFilterChange={handleFilterChange}
                        filterStatus={filterStatus}
                      />
                    )}
                  </motion.div>
                )}

                {tabValue === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DocumentUploader
                      onUploadSuccess={() => {
                        setTabValue(0);
                        refreshDocuments();
                      }}
                      refreshDocuments={refreshDocuments}
                    />

                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                    >
                      <Button
                        onClick={() => setTabValue(0)}
                        color="primary"
                        variant="outlined"
                        startIcon={<AssessmentIcon />}
                      >
                        Back to Documents
                      </Button>
                    </Box>
                  </motion.div>
                )}
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Documents;