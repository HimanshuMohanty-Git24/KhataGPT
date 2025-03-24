import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Fab, Zoom, Snackbar, Alert } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const DashboardLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [pageNotification, setPageNotification] = useState(null);
  
  // Handle scroll position for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Check location state for notifications
  useEffect(() => {
    if (location.state?.message) {
      setPageNotification({
        message: location.state.message,
        severity: location.state.severity || 'success'
      });
      
      // Clear the location state after displaying notification
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setPageNotification(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          // The main content area should account for the fixed header
          pt: { xs: 8, sm: 9 },
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>
      
      <Footer />
      
      {/* Back to top button */}
      <Zoom in={showBackToTop}>
        <Fab
          color="primary"
          size="small"
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 16 : 24,
            right: isMobile ? 16 : 24,
            zIndex: theme.zIndex.snackbar - 1,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
      
      {/* Notifications */}
      <Snackbar
        open={!!pageNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {pageNotification && (
          <Alert 
            onClose={handleCloseNotification} 
            severity={pageNotification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {pageNotification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default DashboardLayout;