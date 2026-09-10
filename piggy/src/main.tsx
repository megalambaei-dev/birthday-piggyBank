import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PaginaPersonalizar from './pages/PaginaPersonalizar'
import React from 'react'

createRoot(document.getElementById('app')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/personalizar" element={<PaginaPersonalizar />} />
    </Routes>
  </BrowserRouter>
)