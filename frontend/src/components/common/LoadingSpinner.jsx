import React from 'react';
import { Box, CircularProgress, Typography, useTheme, alpha } from '@mui/material';

/**
 * Loading spinner component with optional message
 * Can be used inline or as a full page/container overlay
 */
const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 40, 
  thickness = 4,
  fullScreen = false,
  fullContainer = false,
  overlay = false,
  showMessage = true,
  color = 'primary',
  sx = {}
}) => {
  const theme = useTheme();
  
  // For full screen loading
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme.zIndex.modal + 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: overlay 
            ? alpha(theme.palette.background.default, 0.8) 
            : theme.palette.background.default,
          backdropFilter: overlay ? 'blur(4px)' : 'none',
          ...sx
        }}
      >
        <CircularProgress 
          size={size} 
          thickness={thickness} 
          color={color} 
        />
        {showMessage && (
          <Typography 
            variant="body1" 
            color="textSecondary" 
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }
  
  // For container loading
  if (fullContainer) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme.zIndex.appBar - 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: overlay 
            ? alpha(theme.palette.background.paper, 0.7) 
            : 'transparent',
          backdropFilter: overlay ? 'blur(2px)' : 'none',
          ...sx
        }}
      >
        <CircularProgress 
          size={size} 
          thickness={thickness} 
          color={color} 
        />
        {showMessage && (
          <Typography 
            variant="body2" 
            color="textSecondary" 
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }
  
  // Default inline loading
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: showMessage ? 'column' : 'row',
        py: showMessage ? 2 : 1,
        ...sx
      }}
    >
      <CircularProgress 
        size={size} 
        thickness={thickness} 
        color={color} 
      />
      {showMessage && (
        <Typography 
          variant={size > 30 ? "body1" : "body2"} 
          color="textSecondary" 
          sx={{ mt: 1 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;