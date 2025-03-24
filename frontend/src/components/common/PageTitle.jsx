import React from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Divider, 
  Button, 
  Tooltip, 
  useTheme, 
  alpha 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

/**
 * Reusable page title component with breadcrumbs, description, and optional action button
 */
const PageTitle = ({
  title,
  description,
  breadcrumbs = [],
  action,
  actionText,
  actionIcon,
  actionTooltip,
  actionDisabled = false,
  divider = true,
  marginBottom = 4,
  animate = true,
  metaTitle,
  metaDescription,
}) => {
  const theme = useTheme();

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const descVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  const breadcrumbVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.1 } }
  };
  
  const actionVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } }
  };

  // Wrapper component based on animation setting
  const Wrapper = animate ? motion.div : React.Fragment;
  
  return (
    <>
      {/* Document meta tags */}
      {(metaTitle || title) && (
        <Helmet>
          <title>{metaTitle || title} | KhathaGPT</title>
          {(metaDescription || description) && (
            <meta name="description" content={metaDescription || description} />
          )}
        </Helmet>
      )}
      
      <Box sx={{ mb: marginBottom }}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Wrapper
            variants={animate ? breadcrumbVariants : {}}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
          >
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />} 
              aria-label="breadcrumb"
              sx={{ mb: 1 }}
            >
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                
                return isLast ? (
                  <Typography 
                    key={`crumb-${index}`} 
                    color="textPrimary"
                    variant="body2"
                  >
                    {crumb.text}
                  </Typography>
                ) : (
                  <Link
                    key={`crumb-${index}`}
                    component={RouterLink}
                    to={crumb.link || '#'}
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    {crumb.text}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Wrapper>
        )}
        
        {/* Title and Action row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Wrapper
            variants={animate ? titleVariants : {}}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="700"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
          </Wrapper>
          
          {(action || actionText) && (
            <Wrapper
              variants={animate ? actionVariants : {}}
              initial={animate ? "hidden" : undefined}
              animate={animate ? "visible" : undefined}
            >
              {actionTooltip ? (
                <Tooltip title={actionTooltip}>
                  <span>
                    <Button
                      variant="contained"
                      onClick={action}
                      startIcon={actionIcon}
                      disabled={actionDisabled}
                    >
                      {actionText}
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  variant="contained"
                  onClick={action}
                  startIcon={actionIcon}
                  disabled={actionDisabled}
                >
                  {actionText}
                </Button>
              )}
            </Wrapper>
          )}
        </Box>
        
        {/* Description */}
        {description && (
          <Wrapper
            variants={animate ? descVariants : {}}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
          >
            <Typography 
              variant="body1" 
              color="textSecondary" 
              sx={{ mt: 1 }}
            >
              {description}
            </Typography>
          </Wrapper>
        )}
        
        {/* Optional divider */}
        {divider && (
          <Divider 
            sx={{ 
              mt: 3, 
              borderColor: alpha(theme.palette.divider, 0.6) 
            }} 
          />
        )}
      </Box>
    </>
  );
};

export default PageTitle;