import React, { useState } from "react";
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
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const documentsPerPage = 9;

  // Calculate pagination
  const totalPages = Math.ceil(documents.length / documentsPerPage);
  const startIndex = (page - 1) * documentsPerPage;
  const displayedDocuments = documents.slice(
    startIndex,
    startIndex + documentsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (onSearch) onSearch("");
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
        onSubmit={handleSearchSubmit}
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
          <IconButton sx={{ p: "10px" }} aria-label='search'>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder='Search documents...'
            inputProps={{ "aria-label": "search documents" }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
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
                  "&:hover .MuiOutlinedInput-notchedOutline": {
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
            component={Link}
            to='/documents/upload'
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
      <AnimatePresence>
        {loading ? (
          <Grid container spacing={3}>
            {renderSkeletons()}
          </Grid>
        ) : documents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Grid container spacing={3}>
              {!loading &&
                displayedDocuments.map((document) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={document.id || `doc-${Math.random()}`}
                  >
                    <DocumentCard document={document} onDelete={onDelete} />
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
              {searchQuery
                ? "No documents match your search criteria. Try different keywords or clear your search."
                : "You haven't uploaded any documents yet. Upload a document to get started!"}
            </Typography>
            <Button
              component={Link}
              to='/documents/upload'
              variant='contained'
              startIcon={<AddIcon />}
            >
              Upload Your First Document
            </Button>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default DocumentGrid;
