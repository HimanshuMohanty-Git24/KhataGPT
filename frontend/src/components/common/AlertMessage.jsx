import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  AlertTitle, 
  Collapse, 
  IconButton, 
  Box, 
  Typography,
  Snackbar 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * Flexible alert message component that can be used as a snackbar,
 * inline alert, or banner alert
 */
const AlertMessage = ({
  message,
  severity = 'info',
  title,
  variant = 'standard',
  onClose,
  autoHideDuration = 6000,
  showIcon = true,
  action,
  isSnackbar = false,
  autoClose = true,
  sx = {},
  position = { vertical: 'bottom', horizontal: 'left' }
}) => {
  const [open, setOpen] = useState(true);

  // Auto close if needed
  useEffect(() => {
    if (autoClose && !isSnackbar) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoHideDuration, isSnackbar]);
  
  // Reset open state when message changes
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setOpen(false);
    
    if (onClose) {
      onClose();
    }
  };
  
  // If no message, don't render anything
  if (!message) {
    return null;
  }
  
  // Get the appropriate icon
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <ErrorOutlineIcon />;
      case 'warning':
        return <WarningAmberIcon />;
      case 'info':
        return <InfoOutlinedIcon />;
      case 'success':
        return <CheckCircleOutlineIcon />;
      default:
        return <InfoOutlinedIcon />;
    }
  };

  const alertContent = (
    <Alert
      severity={severity}
      variant={variant}
      icon={showIcon ? getIcon() : null}
      action={
        action || (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        )
      }
      sx={{
        width: '100%',
        alignItems: 'center',
        ...sx
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {typeof message === 'string' ? (
        <Typography variant="body2">{message}</Typography>
      ) : (
        message
      )}
    </Alert>
  );

  // Render as a snackbar
  if (isSnackbar) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={position}
      >
        {alertContent}
      </Snackbar>
    );
  }

  // Render as a regular alert with collapse animation
  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        {alertContent}
      </Collapse>
    </Box>
  );
};

export default AlertMessage;