// src/shared-theme/AppTheme.jsx
import React, { useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContext } from './ThemeContext';

export default function AppTheme({ children }) {
  const { mode } = useContext(ThemeContext);

  const theme = createTheme({
    palette: {
      mode, // 'light' or 'dark'
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#dc004e' : '#f48fb1',
      },
      background: {
        default: mode === 'light' ? '#fafafa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      // Example custom headings:
      h4: {
        fontWeight: 700,
        fontSize: '1.8rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.6rem',
      },
      body1: {
        fontSize: '1rem',
      },
      // define other variants as needed ...
    },
    shape: {
      borderRadius: 8, // global border-radius
    },
    components: {
      // Example MUI Button override:
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', // disable uppercase
            borderRadius: 6,
          },
        },
      },
      // Example customizing MUI Paper for dark mode shadows
      MuiPaper: {
        styleOverrides: {
          root: {
            ...(mode === 'dark'
              ? {
                  backgroundImage: 'none', // remove gradients in dark
                  boxShadow: 'none',
                }
              : {}),
          },
        },
      },
      // Additional overrides for other components as needed
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
