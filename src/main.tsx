import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx';
import { enableMockServiceWorker } from './mocks/browser.ts';

const theme = createTheme({
  palette: {
    mode: 'light',
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
