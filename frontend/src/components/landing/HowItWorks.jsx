import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Button, 
  Paper, 
  useTheme,
  useMediaQuery,
  alpha 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatIcon from '@mui/icons-material/Chat';
import InsightsIcon from '@mui/icons-material/Insights';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const steps = [
  {
    label: 'Upload Your Documents',
    description: `Simply drag and drop your files or use the file browser to upload documents. KhathaGPT supports various formats including PDFs, Word documents, Excel spreadsheets, and more.`,
    icon: <CloudUploadIcon />,
    image: '/assets/images/step1.svg'
  },
  {
    label: 'AI Analysis',
    description: `Our advanced AI automatically processes your documents, extracting key information, identifying important concepts, and preparing the content for interactive querying.`,
    icon: <AutoAwesomeIcon />,
    image: '/assets/images/step2.svg'
  },
  {
    label: 'Chat with Your Documents',
    description: `Ask questions in natural language about your documents. Get accurate answers with citations to relevant sections, making document analysis faster and more intuitive.`,
    icon: <ChatIcon />,
    image: '/assets/images/step3.svg'
  },
  {
    label: 'Extract Insights',
    description: `Discover patterns, summarize content, and get recommendations based on your document content. Export insights for presentations or further analysis.`,
    icon: <InsightsIcon />,
    image: '/assets/images/step4.svg'
  }
];

const HowItWorks = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [viewMode, setViewMode] = useState(isMobile ? 'mobile' : 'desktop');

  // Add a delay when switching between mobile and desktop to prevent content from disappearing
  useEffect(() => {
    const timer = setTimeout(() => {
      setViewMode(isMobile ? 'mobile' : 'desktop');
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isMobile]);

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

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Always render both mobile and desktop steppers, but only display the appropriate one
  const renderMobileStepper = () => (
    <Box sx={{ display: viewMode === 'mobile' ? 'block' : 'none', width: '100%' }}>
      <Stepper 
        orientation="vertical" 
        sx={{ 
          mb: 6,
          width: '100%',
          '& .MuiStepConnector-line': {
            minHeight: '40px',
            borderLeftWidth: 3,
            borderColor: theme.palette.primary.main,
          }
        }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            variants={stepVariants}
            style={{ width: '100%' }}
          >
            <Step active={true}>
              <StepLabel
                StepIconProps={{
                  icon: step.icon,
                  sx: {
                    color: theme.palette.primary.main,
                    '& .MuiStepIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    transform: 'scale(1.2)',
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {step.label}
                </Typography>
              </StepLabel>
              
              <StepContent
                sx={{
                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                  ml: 2.5,
                  pl: 3,
                  pb: 3,
                }}
              >
                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
                {step.image && (
                  <Box
                    component="img"
                    src={step.image}
                    alt={step.label}
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 2,
                      mb: 2,
                      boxShadow: theme.shadows[2],
                    }}
                  />
                )}
              </StepContent>
            </Step>
          </motion.div>
        ))}
      </Stepper>
    </Box>
  );

  // Desktop view - horizontal stepper with cards below
  const renderDesktopStepper = () => (
    <Box sx={{ display: viewMode === 'desktop' ? 'block' : 'none', width: '100%' }}>
      <Stepper 
        orientation="horizontal" 
        alternativeLabel 
        sx={{ 
          mb: 6,
          '& .MuiStepConnector-line': {
            borderTopWidth: 3,
            borderColor: theme.palette.primary.main,
          },
          '& .MuiStepIcon-root': {
            color: theme.palette.primary.main,
            width: '2em',
            height: '2em',
          },
          '& .MuiStepIcon-text': {
            fill: theme.palette.common.white,
            fontWeight: 'bold',
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label} active={true} completed={false}>
            <StepLabel
              icon={step.icon}
              StepIconProps={{
                sx: {
                  color: theme.palette.primary.main,
                  '& .MuiStepIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 8 }}>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={stepVariants}
          >
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: 4,
                mb: 4,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out'
                },
              }}
            >
              {step.image && (
                <Box
                  sx={{
                    width: { xs: '100%', md: '40%' },
                  }}
                >
                  <Box
                    component="img"
                    src={step.image}
                    alt={step.label}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 2,
                      boxShadow: theme.shadows[1],
                    }}
                  />
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  {index + 1}. {step.label}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {step.description}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </Box>
    </Box>
  );

  // This component handles the transition between mobile and desktop views
  const renderFallbackContent = () => (
    <Box sx={{ 
      display: viewMode === 'mobile' || viewMode === 'desktop' ? 'none' : 'block',
      width: '100%', 
      my: 4
    }}>
      {steps.map((step, index) => (
        <Box key={index} sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              mr: 2, 
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {React.cloneElement(step.icon, { fontSize: 'large' })}
            </Box>
            {index + 1}. {step.label}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2, pl: 6 }}>
            {step.description}
          </Typography>
          {step.image && (
            <Box sx={{ pl: 6 }}>
              <Box
                component="img"
                src={step.image}
                alt={step.label}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
        position: 'relative',
        overflow: 'hidden',
      }}
      id="how-it-works"
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0) 100%)',
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
              How It Works
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
              KhathaGPT provides a seamless experience from document upload to insight extraction
            </Typography>
          </motion.div>

          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {/* Always render all three components, but only display the appropriate one */}
            {renderMobileStepper()}
            {renderDesktopStepper()}
            {renderFallbackContent()}

            <motion.div
              variants={headerVariants}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '3rem',
              }}
            >
              <Button
                component={Link}
                to="/documents"
                variant="contained"
                size="large"
                startIcon={<CloudUploadIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  fontWeight: 600,
                  boxShadow: theme.shadows[4],
                }}
              >
                Try It Now
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HowItWorks;