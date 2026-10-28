import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Keep previously shared hash links working while using clean page URLs.
const legacyPages = { '#help': '/', '#about': '/about', '#my-story': '/my-story', '#donate': '/donate', '#contact': '/contact' }
const legacyPath = legacyPages[window.location.hash]
if (window.location.pathname === '/' && legacyPath) {
  window.history.replaceState(null, '', legacyPath + window.location.search)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
