import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  useTheme, 
  alpha 
} from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

const technologies = [
  {
    name: 'React & Material UI',
    icon: <CodeIcon fontSize="large" />,
    description: 'Modern frontend framework with beautiful UI components for responsive design',
    color: '#61DAFB',
  },
  {
    name: 'FastAPI & Python',
    icon: <SpeedIcon fontSize="large" />,
    description: 'High-performance API framework for efficient backend processing',
    color: '#05998b',
  },
  {
    name: 'MongoDB',
    icon: <StorageIcon fontSize="large" />,
    description: 'Flexible NoSQL database for document storage and retrieval',
    color: '#4DB33D',
  },
  {
    name: 'Google Gemini AI',
    icon: <SmartToyIcon fontSize="large" />,
    description: 'Cutting-edge AI model for advanced document analysis and natural language processing',
    color: '#4285F4',
  },
  {
    name: 'Cloud Infrastructure',
    icon: <CloudIcon fontSize="large" />,
    description: 'Scalable cloud architecture for reliable performance and growth',
    color: '#FF9900',
  },
  {
    name: 'Secure Data Handling',
    icon: <SecurityIcon fontSize="large" />,
    description: 'Enterprise-grade security protocols for document and data protection',
    color: '#FF5722',
  },
];

const TechStack = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} justifyContent="center">
        {technologies.map((tech, index) => (
          <Grid item xs={12} sm={6} md={4} key={tech.name}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    boxShadow: theme.shadows[10],
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    mb: 2,
                    background: alpha(tech.color, 0.1),
                    color: tech.color,
                  }}
                >
                  {tech.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {tech.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {tech.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TechStack;