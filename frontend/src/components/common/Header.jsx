import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Container, 
  useTheme, 
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  alpha
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import ThemeToggle from './ThemeToggle';

// Hide AppBar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation items
  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Documents', path: '/documents', icon: <DescriptionIcon /> },
  ];

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Check if the path is active
  const isPathActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2 }}>
        <Typography variant="h6" color="primary" component="div" sx={{ fontWeight: 600 }}>
          KhathaGPT
        </Typography>
        <IconButton color="inherit" onClick={handleDrawerToggle} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={isPathActive(item.path)}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              backgroundColor: isPathActive(item.path) 
                ? alpha(theme.palette.primary.main, 0.1) 
                : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: isPathActive(item.path) ? theme.palette.primary.main : 'inherit',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: isPathActive(item.path) ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Theme
          </Typography>
          <ThemeToggle />
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed"
          color="default" 
          elevation={isScrolled ? 4 : 0}
          sx={{
            backgroundColor: isScrolled 
              ? theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.9) 
                : alpha(theme.palette.background.paper, 0.9)
              : theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.default, 0.9)
                : 'transparent',
            backdropFilter: 'blur(8px)',
            transition: 'background-color 0.3s, box-shadow 0.3s',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              {/* Logo / Brand */}
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                KhathaGPT
              </Typography>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4, flexGrow: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    sx={{ 
                      mx: 1, 
                      fontWeight: isPathActive(item.path) ? 600 : 400,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              {/* Action buttons and theme toggle */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                ml: 'auto' // This ensures the items are pushed to the right
              }}>
                <Box sx={{ mr: { xs: 2, md: 0 } }}>
                  <ThemeToggle />
                </Box>
                
                {/* Mobile menu button - positioned at the end */}
                <IconButton
                  aria-label="open menu"
                  onClick={handleDrawerToggle}
                  edge="end"
                  sx={{ 
                    display: { md: 'none' },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Toolbar placeholder to prevent content from hiding under the app bar */}
      <Toolbar />
    </>
  );
};

export default Header;