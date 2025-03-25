import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import { debounce } from 'lodash';

const SearchBar = ({ 
  onSearch, 
  onSortChange, 
  onFilterChange,
  initialSearchTerm = '',
  initialSortBy = 'uploaded_at',
  initialSortDirection = 'desc',
  initialFilterStatus = 'all'
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  const [filterStatus, setFilterStatus] = useState(initialFilterStatus);
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);
  
  // Create debounced search function that won't trigger focus loss
  const debouncedSearch = useRef(
    debounce((value) => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300)
  ).current;
  
  useEffect(() => {
    // Only apply debouncing for actual changes to prevent unnecessary API calls
    if (searchTerm !== initialSearchTerm) {
      debouncedSearch(searchTerm);
    }
    // No need to call API when component mounts with empty search
  }, [searchTerm, debouncedSearch, initialSearchTerm]);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Allow live feedback for empty searches (clearing)
    if (!value.trim()) {
      onSearch('');
    } else {
      // For non-empty searches, use debounce to prevent too many API calls
      debouncedSearch(value);
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
    // Return focus to the search field after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const handleSortByChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    
    if (onSortChange) {
      onSortChange(newSortBy, sortDirection);
    }
  };
  
  const handleSortDirectionToggle = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    
    if (onSortChange) {
      onSortChange(sortBy, newDirection);
    }
  };
  
  const handleFilterStatusChange = (e) => {
    const newStatus = e.target.value;
    setFilterStatus(newStatus);
    
    if (onFilterChange) {
      onFilterChange(newStatus);
    }
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(4px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search documents by title or content..."
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          inputRef={searchInputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mr: 1 }}
        />
        
        <IconButton 
          color={showFilters ? "primary" : "default"}
          onClick={toggleFilters} 
          sx={{ 
            borderRadius: 1,
            border: showFilters ? `1px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
            p: 1,
            height: 40
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Box>
      
      {showFilters && (
        <Box 
          sx={{ 
            mt: 2, 
            display: 'flex', 
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
              Sort by:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={sortBy}
                onChange={handleSortByChange}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="uploaded_at">Upload Date</MenuItem>
                <MenuItem value="filename">Filename</MenuItem>
                <MenuItem value="file_size">File Size</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
            
            <IconButton size="small" onClick={handleSortDirectionToggle} sx={{ ml: 1 }}>
              <SortIcon 
                sx={{ 
                  transform: sortDirection === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </IconButton>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
              Status:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={filterStatus}
                onChange={handleFilterStatusChange}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="processed">Processed</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SearchBar;