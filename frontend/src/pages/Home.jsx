import React from 'react';
import { Box, Container, Button, Typography, useTheme } from '@mui/material';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import landing page components
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import HowItWorks from '../components/landing/HowItWorks';
import TechStack from '../components/landing/TechStack';
import UseCases from '../components/landing/UseCases';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';

const Home = () => {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title>KhathaGPT | AI-Powered Document Analysis and Chat</title>
        <meta name="description" content="Upload documents and chat with your files. KhathaGPT uses AI to extract insights from your documents and answer your questions." />
        <meta property="og:title" content="KhathaGPT | AI-Powered Document Analysis and Chat" />
        <meta property="og:description" content="Upload documents and chat with your files. KhathaGPT uses AI to extract insights from your documents and answer your questions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://khathagpt.com" />
        <meta property="og:image" content="https://khathagpt.com/og-image.png" />
      </Helmet>

      <Header />
      
      <Box component="main">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Feature Section */}
        <FeatureSection />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Use Cases */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 }, 
            backgroundColor: theme.palette.background.default 
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                component="h2"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Use Cases
              </Typography>
              
              <Typography
                variant="h5"
                component="p"
                align="center"
                color="textSecondary"
                sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
              >
                KhathaGPT helps professionals across industries streamline document workflows
              </Typography>
              
              <UseCases />
            </motion.div>
          </Container>
        </Box>
        
        {/* Technology Stack */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 }, 
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.background.paper 
              : theme.palette.grey[50]
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                component="h2"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Powered By Modern Technology
              </Typography>
              
              <Typography
                variant="h5"
                component="p"
                align="center"
                color="textSecondary"
                sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
              >
                Built with cutting-edge technologies for optimal performance and reliability
              </Typography>
              
              <TechStack />
            </motion.div>
          </Container>
        </Box>
        
        {/* Final CTA Section */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 }, 
            background: `linear-gradient(45deg, ${theme.palette.primary.dark} 10%, ${theme.palette.primary.main} 90%)`,
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                Start Extracting Insights Today
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                Upload your first document and experience the power of AI-driven document analysis.
              </Typography>
              
              <Button
                component={Link}
                to="/documents"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    bgcolor: 'white',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Try KhathaGPT Free
              </Button>
              
              {/* <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                No credit card required • Free for basic usage
              </Typography> */}
            </motion.div>
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </>
  );
};

export default Home;