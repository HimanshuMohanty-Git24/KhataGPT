import React from 'react';
import { Box, Container, Typography, Button, Paper, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PageNotFound = () => {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title>Page Not Found | KhathaGPT</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      
      <Header />
      
      <Box 
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
          backgroundColor: theme.palette.background.default
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              textAlign: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '6rem', md: '10rem' },
                  fontWeight: 900,
                  color: theme.palette.primary.main,
                  opacity: 0.2,
                  position: 'absolute',
                  top: { xs: 20, md: 0 },
                  left: 0,
                  right: 0,
                  zIndex: 0,
                }}
              >
                404
              </Typography>
              
              <Box sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 12 } }}>
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  Page Not Found
                </Typography>
                
                <Typography
                  variant="h6"
                  color="textSecondary"
                  sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
                >
                  The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </Typography>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'center',
                      gap: 2,
                      my: 4,
                    }}
                  >
                    <Button
                      component={Link}
                      to="/"
                      variant="contained"
                      size="large"
                      startIcon={<HomeIcon />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      Back to Home
                    </Button>
                    
                    <Button
                      component={Link}
                      to="/documents"
                      variant="outlined"
                      size="large"
                      startIcon={<SearchIcon />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      Browse Documents
                    </Button>
                  </Box>
                </motion.div>
                
                <Box
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  sx={{
                    mt: 5,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.03)' 
                      : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    If you believe this is an error, please contact our support team or try again later.
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
    </>
  );
};

export default PageNotFound;