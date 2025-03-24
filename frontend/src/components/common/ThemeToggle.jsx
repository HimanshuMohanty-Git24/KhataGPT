import React, { useContext } from 'react';
import { IconButton, useTheme, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const theme = useTheme();
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        aria-label="toggle light/dark theme"
        sx={{ 
          borderRadius: '50%',
          transition: 'all 0.3s',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <motion.div
          animate={{ rotate: mode === 'light' ? 0 : 180 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        >
          {mode === 'dark' ? (
            <Brightness7Icon sx={{ color: '#FFD700' }} />
          ) : (
            <Brightness4Icon sx={{ color: '#1976d2' }} />
          )}
        </motion.div>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;