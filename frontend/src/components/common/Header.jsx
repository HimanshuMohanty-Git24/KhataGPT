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
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              KhathaGPT
            </Typography>
          </RouterLink>
        </Box>
        <IconButton onClick={handleDrawerToggle} aria-label="close drawer">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            onClick={handleDrawerToggle}
            selected={isPathActive(item.path)}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              backgroundColor: isPathActive(item.path) 
                ? alpha(theme.palette.primary.main, 0.1) 
                : 'transparent',
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: isPathActive(item.path) 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary 
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: isPathActive(item.path) ? 600 : 400,
                color: isPathActive(item.path) 
                  ? theme.palette.primary.main 
                  : theme.palette.text.primary
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 20, width: '100%', px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Dark Mode
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
          color="inherit" 
          elevation={isScrolled ? 2 : 0}
          sx={{
            bgcolor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, isScrolled ? 0.9 : 0.8)
              : alpha(theme.palette.background.paper, isScrolled ? 0.9 : 0.8),
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ py: 0.5 }}>
              {/* Logo */}
              <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  src="/assets/images/logo.svg"
                  alt="KhathaGPT Logo"
                  sx={{ height: 35, mr: 1 }}
                />
                <Typography 
                  variant="h6" 
                  color="primary" 
                  sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}
                >
                  KhathaGPT
                </Typography>
              </RouterLink>

              {/* Desktop navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      mx: 1,
                      color: isPathActive(item.path) 
                        ? theme.palette.primary.main 
                        : theme.palette.text.primary,
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ ml: { xs: 1, md: 2 } }}>
                  <ThemeToggle />
                </Box>
                
                {/* Mobile menu button */}
                <IconButton
                  aria-label="open menu"
                  onClick={handleDrawerToggle}
                  edge="end"
                  sx={{ ml: 1, display: { md: 'none' } }}
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