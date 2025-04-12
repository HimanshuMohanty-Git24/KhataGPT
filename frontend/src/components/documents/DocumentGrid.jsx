import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Box,
  Typography,
  Paper,
  InputBase,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Skeleton,
  useTheme,
  alpha,
  Button,
  Stack,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import DocumentCard from "./DocumentCard";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";

const DocumentGrid = ({
  documents = [],
  loading = false,
  onDelete,
  onSearch,
  searchQuery = "",
  setSearchQuery,
  onSortChange,
  sortBy = "uploaded_at",
  sortDirection = "desc",
  onFilterChange,
  filterStatus = "all",
  onSwitchToUpload,
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const documentsPerPage = 9;
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localSearchResults, setLocalSearchResults] = useState(documents);
  const [isLocalSearching, setIsLocalSearching] = useState(false);

  // Update local search query when parent search query changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Update local search results when documents change
  useEffect(() => {
    setLocalSearchResults(documents);
  }, [documents]);

  // Handle local search for instant feedback
  useEffect(() => {
    // If search is empty, show all documents
    if (!localSearchQuery.trim()) {
      setLocalSearchResults(documents);
      setPage(1);
      return;
    }

    // Debounce to avoid excessive filtering when typing
    const timer = setTimeout(() => {
      const query = localSearchQuery.toLowerCase();

      // Enhanced filtering that looks for content in all possible fields
      const filtered = documents.filter((doc) => {
        // Check title, content and type
        const titleMatch =
          doc.filename && doc.filename.toLowerCase().includes(query);
        const contentMatch =
          (doc.extracted_text &&
            doc.extracted_text.toLowerCase().includes(query)) ||
          (doc.content && doc.content.toLowerCase().includes(query));
        const typeMatch =
          doc.doc_type && doc.doc_type.toLowerCase().includes(query);

        return titleMatch || contentMatch || typeMatch;
      });

      // Set filtered results to state variable
      setLocalSearchResults(filtered);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, documents]);

  // Create debounced search function for server-side search
  const debouncedSearch = React.useCallback(
    debounce((value) => {
      if (onSearch) onSearch(value);
    }, 600), // Longer debounce for server-side to avoid excessive API calls
    [onSearch]
  );

  // Calculate pagination
  const totalPages = Math.ceil(localSearchResults.length / documentsPerPage);
  const startIndex = (page - 1) * documentsPerPage;
  const displayedDocuments = localSearchResults.slice(
    startIndex,
    startIndex + documentsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value); // Update local state immediately for UI

    // Only trigger server-side search for non-trivial searches
    if (value.trim().length > 2 || value.trim() === "") {
      setSearchQuery(value); // Update parent state
      debouncedSearch(value); // Trigger server-side search with debounce
    }
  };

  const handleClearSearch = (e) => {
    if (e) {
      e.preventDefault(); // Prevent default to maintain focus
      e.stopPropagation(); // Stop propagation
    }
    setLocalSearchQuery(""); // Clear local search
    setSearchQuery(""); // Clear parent state
    onSearch(""); // Trigger search with empty query
  };

  const handleSortChange = (e) => {
    if (onSortChange) onSortChange(e.target.value);
  };

  const handleFilterChange = (e) => {
    if (onFilterChange) onFilterChange(e.target.value);
  };

  // Create skeleton loaders
  const renderSkeletons = () => {
    return Array.from(new Array(6)).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
        <DocumentCard loading={true} />
      </Grid>
    ));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search and Filter Bar */}
      <Paper
        component='form'
        onSubmit={(e) => e.preventDefault()} // Prevent form submission to avoid page refresh
        elevation={1}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          mb: 4,
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: { xs: 1, md: 0 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label='search' disabled>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder='Search documents by content or title...'
            inputProps={{ "aria-label": "search documents" }}
            value={localSearchQuery}
            onChange={handleSearchChange}
            autoComplete='off'
          />
          {localSearchQuery && (
            <IconButton
              sx={{ p: "10px" }}
              aria-label='clear search'
              onClick={handleClearSearch}
            >
              <ClearIcon />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: { xs: 1, md: 0 },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SortIcon
              fontSize='small'
              sx={{ color: theme.palette.text.secondary, mr: 1 }}
            />
            <FormControl size='small' variant='outlined' sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                displayEmpty
                inputProps={{ "aria-label": "Sort by" }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value='uploaded_at'>Date Added</MenuItem>
                <MenuItem value='filename'>File Name</MenuItem>
                <MenuItem value='status'>Status</MenuItem>
                <MenuItem value='file_size'>File Size</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FilterListIcon
              fontSize='small'
              sx={{ color: theme.palette.text.secondary, mr: 1 }}
            />
            <FormControl size='small' variant='outlined' sx={{ minWidth: 120 }}>
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                displayEmpty
                inputProps={{ "aria-label": "Filter by status" }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover .MuiOutlinedLine-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value='all'>All Status</MenuItem>
                <MenuItem value='processed'>Processed</MenuItem>
                <MenuItem value='processing'>Processing</MenuItem>
                <MenuItem value='failed'>Failed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            onClick={() => {
              // Find the parent Documents component's setTabValue function and call it
              if (onSwitchToUpload) {
                onSwitchToUpload();
              }
            }}
            variant='contained'
            size='small'
            startIcon={<AddIcon />}
            sx={{
              borderRadius: "20px",
              ml: { xs: "auto", md: 2 },
              px: 2,
            }}
          >
            Upload
          </Button>
        </Box>
      </Paper>

      {/* Document Grid */}
      <AnimatePresence mode='wait'>
        {loading || isLocalSearching ? (
          <Grid container spacing={3} key='loading-grid'>
            {renderSkeletons()}
          </Grid>
        ) : localSearchResults.length > 0 ? (
          <motion.div
            key='documents-grid'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Grid container spacing={3}>
              {displayedDocuments.map((document) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={document.id || `doc-${Math.random()}`}
                >
                  <DocumentCard
                    document={document}
                    onDelete={onDelete}
                    searchQuery={localSearchQuery}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack
                spacing={2}
                sx={{ mt: 4, display: "flex", alignItems: "center" }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  variant='outlined'
                  shape='rounded'
                  color='primary'
                />
              </Stack>
            )}
          </motion.div>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              textAlign: "center",
            }}
            component={motion.div}
            key='empty-state'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DoDisturbIcon
              sx={{
                fontSize: 60,
                color: alpha(theme.palette.text.secondary, 0.5),
                mb: 2,
              }}
            />
            <Typography variant='h6' gutterBottom>
              No documents found
            </Typography>
            <Typography
              variant='body2'
              color='textSecondary'
              sx={{ mb: 3, maxWidth: "500px" }}
            >
              {localSearchQuery
                ? "No documents match your search criteria. Try different keywords or clear your search."
                : "You haven't uploaded any documents yet. Start by clicking the Upload button."}
            </Typography>
            {localSearchQuery && (
              <Button
                variant='outlined'
                startIcon={<ClearIcon />}
                onClick={() => handleClearSearch()}
                sx={{ mb: 2 }}
              >
                Clear Search
              </Button>
            )}
            <Button
              onClick={onSwitchToUpload} // Change here - call onSwitchToUpload directly
              variant='contained'
              startIcon={<AddIcon />}
            >
              Upload Document
            </Button>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default DocumentGrid;
