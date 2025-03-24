import React, { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  useTheme,
  alpha 
} from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

const features = [
  {
    icon: <DocumentScannerIcon fontSize="large" />,
    title: 'Smart Document Analysis',
    description: 'Upload various document types including PDFs, Word documents, and images. Our AI extracts and organizes key information automatically.'
  },
  {
    icon: <ChatIcon fontSize="large" />,
    title: 'Interactive Chat',
    description: 'Chat with your documents naturally. Ask questions and get accurate answers with direct references to relevant sections.'
  },
  {
    icon: <SearchIcon fontSize="large" />,
    title: 'Advanced Search',
    description: 'Find specific information across all your documents with powerful semantic search capabilities.'
  },
  {
    icon: <ManageSearchIcon fontSize="large" />,
    title: 'Document Management',
    description: 'Organize, categorize, and manage your documents in a centralized location for easy access and collaboration.'
  },
  {
    icon: <SecurityIcon fontSize="large" />,
    title: 'Secure & Private',
    description: 'Your documents remain private and secure. We prioritize data protection and compliance with privacy standards.'
  },
  {
    icon: <SpeedIcon fontSize="large" />,
    title: 'Fast Processing',
    description: 'Experience rapid document analysis and real-time responses to your queries for maximum efficiency.'
  }
];

const FeatureSection = () => {
  const theme = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.background.default,
        position: 'relative',
      }}
      id="features"
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '20vw',
          height: '20vw',
          maxWidth: '300px',
          maxHeight: '300px',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '15vw',
          height: '15vw',
          maxWidth: '200px',
          maxHeight: '200px',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div variants={headerVariants}>
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
              Key Features
            </Typography>
          </motion.div>
          
          <motion.div variants={headerVariants}>
            <Typography
              variant="h5"
              component="p"
              align="center"
              color="textSecondary"
              sx={{
                mb: 8,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              KhathaGPT transforms how you interact with documents using cutting-edge AI technology
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      transition: 'all 0.3s ease-in-out',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[10],
                        borderColor: 'transparent',
                        '& .feature-icon': {
                          color: theme.palette.primary.main,
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 3,
                        }}
                      >
                        <Box
                          className="feature-icon"
                          sx={{
                            p: 2,
                            borderRadius: '50%',
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: alpha(theme.palette.text.primary, 0.7),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {feature.icon}
                        </Box>
                      </Box>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h3"
                        align="center"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        align="center"
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FeatureSection;