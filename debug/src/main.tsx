import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Navigate from './Navigate'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navigate />
    <App />
  </StrictMode>,
)
