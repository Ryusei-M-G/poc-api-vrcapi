import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import FormGetName from './FormGetName'
import Navigate from './Navigate'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navigate />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/getname" element={<FormGetName />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
