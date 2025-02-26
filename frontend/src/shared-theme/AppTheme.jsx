// src/shared-theme/AppTheme.jsx
import React, { useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContext } from './ThemeContext';

export default function AppTheme({ children }) {
  const { mode } = useContext(ThemeContext);

  // Example advanced theme configuration:
  const theme = createTheme({
    palette: {
      mode, // 'light' or 'dark'
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#dc004e' : '#f48fb1',
      },
      // Example background modifications:
      background: {
        default: mode === 'light' ? '#fafafa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      // Example custom headings:
      h5: {
        fontWeight: 600,
      },
      // You can define other variants here...
    },
    shape: {
      borderRadius: 8, // global border-radius
    },
    components: {
      // Example component override:
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', // disable uppercase
            borderRadius: 6,
          },
        },
      },
      // You can customize other MUI components similarly
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
