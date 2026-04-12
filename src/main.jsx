import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'

// Pages
import Login from './pages/Login'
import Home from './pages/Home'
import NewEngagement from './pages/NewEngagement'
import Dashboard from './pages/Dashboard'
import Survey from './pages/Survey'
import CompletionPage from './pages/CompletionPage'

// Simple auth check
function ProtectedRoute({ children }) {
  const authed = localStorage.getItem('bh_ohi_auth') === 'true'
  if (!authed) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/survey/:token" element={<Survey />} />
        <Route path="/survey/complete" element={<CompletionPage />} />

        {/* Admin routes (protected) */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/new" element={<ProtectedRoute><NewEngagement /></ProtectedRoute>} />
        <Route path="/engagement/:id" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', background: '#f0f2f5', flexDirection: 'column', padding: 20,
    }}>
      <img src="/bh-horse.png" alt="Blue Hen" style={{ height: 56, marginBottom: 20, opacity: 0.5 }} />
      <h1 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: '#131B55' }}>Page Not Found</h1>
      <p style={{ margin: '0 0 24px', color: '#888', fontSize: '0.9375rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" style={{
        display: 'inline-block', padding: '12px 32px', background: '#131B55',
        color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
      }}>Go to Admin</a>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
