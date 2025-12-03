import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx';
import { enableMockServiceWorker } from './mocks/browser.ts';

// Modern tech/electronics store theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Clean tech blue
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00bcd4', // Teal accent
      light: '#4dd0e1',
      dark: '#0097a7',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f7', // Light gray (Apple-style)
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2.125rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 12px 32px rgba(0, 0, 0, 0.14)',
    '0 16px 48px rgba(0, 0, 0, 0.16)',
    '0 20px 64px rgba(0, 0, 0, 0.18)',
    '0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 12px 32px rgba(0, 0, 0, 0.14)',
    '0 16px 48px rgba(0, 0, 0, 0.16)',
    '0 20px 64px rgba(0, 0, 0, 0.18)',
    '0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 12px 32px rgba(0, 0, 0, 0.14)',
    '0 16px 48px rgba(0, 0, 0, 0.16)',
    '0 20px 64px rgba(0, 0, 0, 0.18)',
    '0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 12px 32px rgba(0, 0, 0, 0.14)',
    '0 16px 48px rgba(0, 0, 0, 0.16)',
    '0 20px 64px rgba(0, 0, 0, 0.18)',
  ],
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '10px 24px',
          fontSize: '0.9375rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.24)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

async function startApp() {
  try {
    await enableMockServiceWorker();
    console.log('[App] MSW initialized successfully');
    
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App/>
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('[App] Failed to initialize MSW:', error);
    // Все равно рендерим приложение, но без MSW
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App/>
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>,
    );
  }
}

startApp();
