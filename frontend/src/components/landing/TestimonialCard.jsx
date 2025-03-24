import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Box, 
  Rating, 
  useTheme, 
  alpha 
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { motion } from 'framer-motion';

/**
 * Testimonial card component for displaying user testimonials
 */
const TestimonialCard = ({
  name,
  role,
  company,
  quote,
  rating = 5,
  avatar,
  index = 0,
  animate = true
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.5,
      }}
    >
      <Card
        elevation={1}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          overflow: 'visible',
          position: 'relative',
          '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'translateY(-5px)',
          },
        }}
      >
        {/* Quote icon */}
        <Box
          sx={{
            position: 'absolute',
            top: -15,
            left: 20,
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            boxShadow: theme.shadows[2],
          }}
        >
          <FormatQuoteIcon sx={{ fontSize: 18 }} />
        </Box>

        <CardContent sx={{ p: 3, pt: 4, flexGrow: 1 }}>
          {/* Rating */}
          {rating > 0 && (
            <Box sx={{ mb: 2 }}>
              <Rating value={rating} readOnly size="small" />
            </Box>
          )}
          
          {/* Quote */}
          <Typography 
            variant="body1" 
            component="div"
            sx={{ 
              mb: 3,
              fontStyle: 'italic',
              color: theme.palette.text.primary,
              lineHeight: 1.7,
            }}
          >
            "{quote}"
          </Typography>
          
          {/* Author info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
            <Avatar
              src={avatar}
              alt={name}
              sx={{ 
                width: 48, 
                height: 48,
                bgcolor: avatar ? 'transparent' : theme.palette.primary.main,
              }}
            >
              {!avatar && name.charAt(0)}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {name}
              </Typography>
              <Typography 
                variant="body2" 
                color="textSecondary"
              >
                {role}
                {company && `, ${company}`}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;