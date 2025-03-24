import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider, 
  IconButton, 
  useTheme, 
  alpha 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 6, 
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.9)
          : alpha(theme.palette.background.paper, 0.9),
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Box
              component={RouterLink}
              to="/"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mb: 2
              }}
            >
              <Box
                component="img"
                src="/assets/images/logo.svg"
                alt="KhathaGPT Logo"
                sx={{ height: 35, mr: 1 }}
              />
              <Typography 
                variant="h6" 
                color="primary" 
                sx={{ fontWeight: 700 }}
              >
                KhathaGPT
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              Unlock insights from your documents with AI-powered analysis and natural language conversations.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton 
                href="https://github.com/HimanshuMohanty-Git24/KhataGPT" 
                target="_blank" 
                rel="noopener noreferrer"
                size="small"
                aria-label="GitHub"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton 
                href="https://www.linkedin.com/in/himanshumohanty/" 
                target="_blank" 
                rel="noopener noreferrer"
                size="small"
                aria-label="LinkedIn"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton 
                href="https://twitter.com/CodingHima" 
                target="_blank" 
                rel="noopener noreferrer"
                size="small"
                aria-label="Twitter"
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Resources
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component={RouterLink} 
                  to="/documents" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  Documents
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component="a" 
                  href="#" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  Help Center
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component="a" 
                  href="#" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  Guides
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component="a" 
                  href="#" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  About
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component="a" 
                  href="#" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  Contact
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component="a" 
                  href="#" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  Blog
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component="a" 
                  href="#" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  Privacy
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component="a" 
                  href="#" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  Terms
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  component="a" 
                  href="#" 
                  color="textSecondary"
                  underline="hover"
                  variant="body2"
                >
                  Cookies
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            © {currentYear} KhathaGPT. All rights reserved.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Made with ❤️ for document analysis
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;