import React, { createContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from '../config/theme';

// Create context
export const ThemeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

// Theme provider component
export const CustomThemeProvider = ({ children }) => {
  // Check if user previously selected dark mode
  const storedMode = localStorage.getItem('themeMode');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultMode = storedMode || (prefersDarkMode ? 'dark' : 'light');
  
  const [mode, setMode] = useState(defaultMode);

  // Create theme based on mode
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Toggle theme handler
  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Context value
  const contextValue = useMemo(() => ({
    mode,
    toggleMode,
  }), [mode]);

  // Set body background color when theme changes
  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};