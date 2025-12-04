import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    gray: {
      50: string
      100: string
      300: string
      500: string
      700: string
      900: string
    }
  }

  interface PaletteOptions {
    gray?: {
      50?: string
      100?: string
      300?: string
      500?: string
      700?: string
      900?: string
    }
  }
}

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#3D5AFE',
        light: '#8187FF',
        dark: '#0028CA',
      },
      secondary: {
        main: '#FF5252',
        light: '#FF867F',
        dark: '#C50E29',
      },
      success: {
        main: '#4CAF50',
      },
      error: {
        main: '#F44336',
      },
      warning: {
        main: '#FFC107',
      },
      background: {
        default: mode === 'light' ? '#F6F7FB' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#FFFFFF',
        secondary: mode === 'light' ? '#757575' : '#B0B0B0',
      },
      gray: {
        50: mode === 'light' ? '#FAFAFA' : '#2A2A2A',
        100: mode === 'light' ? '#F5F5F5' : '#1E1E1E',
        300: mode === 'light' ? '#E0E0E0' : '#424242',
        500: mode === 'light' ? '#9E9E9E' : '#757575',
        700: mode === 'light' ? '#424242' : '#B0B0B0',
        900: mode === 'light' ? '#212121' : '#FFFFFF',
      },
    },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          '&:hover': {
            opacity: 0.9,
          },
          '&:active': {
            opacity: 0.8,
          },
          '&:disabled': {
            backgroundColor: mode === 'light' ? '#E0E0E0' : '#424242',
            color: mode === 'light' ? '#9E9E9E' : '#757575',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            mode === 'light'
              ? '0 2px 8px rgba(0,0,0,0.05)'
              : '0 2px 8px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
  })

// Export default light theme for backward compatibility
export const theme = getTheme('light')


