import React from 'react'
import ReactDOM from 'react-dom/client'

// Suppress Recharts ResizeObserver console warnings in React 18 Strict Mode
const originalConsoleWarn = console.warn;
console.warn = function (...args) {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('The width') && args[0].includes('of chart should be greater than 0')) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)