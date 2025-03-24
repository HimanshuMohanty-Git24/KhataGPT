import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  alpha,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const useCases = [
  {
    title: 'Business & Finance',
    icon: <BusinessIcon fontSize="large" />,
    description: 'Analyze financial statements, contracts, and business reports to extract key insights and automate data entry.',
    color: '#1976d2'
  },
  {
    title: 'Education & Research',
    icon: <SchoolIcon fontSize="large" />,
    description: 'Extract information from academic papers, research documents, and educational materials for study and analysis.',
    color: '#2e7d32'
  },
  {
    title: 'Healthcare',
    icon: <LocalHospitalIcon fontSize="large" />,
    description: 'Process medical documents, patient records, and research papers to support clinical decisions and research.',
    color: '#d32f2f'
  },
  {
    title: 'Legal',
    icon: <AccountBalanceIcon fontSize="large" />,
    description: 'Analyze legal documents, contracts, and case files to identify key clauses and precedents.',
    color: '#7b1fa2'
  },
  {
    title: 'Compliance & Auditing',
    icon: <FactCheckIcon fontSize="large" />,
    description: 'Review regulatory documents and compliance reports to ensure adherence to standards and policies.',
    color: '#ff9800'
  },
  {
    title: 'Customer Support',
    icon: <SupportAgentIcon fontSize="large" />,
    description: 'Analyze customer communications and support documents to improve response quality and efficiency.',
    color: '#0288d1'
  }
];

const UseCases = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={4}>
      {useCases.map((useCase, index) => (
        <Grid item xs={12} sm={6} md={4} key={useCase.title}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-5px)',
                  borderColor: 'transparent',
                },
              }}
            >
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(useCase.color, 0.1),
                      color: useCase.color,
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    {useCase.icon}
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {useCase.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {useCase.description}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default UseCases;