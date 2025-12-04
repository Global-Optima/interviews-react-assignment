import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

async function enableMocking() {
  // Enable MSW in both development and production for demo purposes
  if (typeof window === 'undefined') {
    return
  }

  try {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
  } catch (error) {
    console.warn('Failed to start MSW:', error)
    // Continue even if MSW fails to start
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})


