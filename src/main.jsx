import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D3748',
    },
    secondary: {
      main: '#38B2AC',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)