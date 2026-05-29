import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import FileDetailPage from './pages/FileDetailPage'
import SecureAdminPage from './pages/SecureAdminPage'
import SecureAdminLoginPage from './pages/SecureAdminLoginPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'

// ─── Admin-Only Route Guard ───────────────────────────────────────────────────
// Handles three states:
//   1. Still loading auth session  → spinner
//   2. Not logged in               → redirect to hidden login
//   3. Logged in but wrong email   → unauthorized page
//   4. Correct admin email         → render children
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
          style={{ animation: 'spin-smooth 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!user) return <Navigate to="/secure-admin-upload/login" replace />
  if (!isAdmin) return <Navigate to="/unauthorized" replace />
  return children
}

// ─── App Layout (public pages with Navbar + Footer) ───────────────────────────
const AppLayout = () => {
  const [globalSearch, setGlobalSearch] = useState('')
  const handleSearch = useCallback((q) => setGlobalSearch(q), [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleSearch} searchQuery={globalSearch} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage externalSearch={globalSearch} />} />
          <Route path="/file/:id" element={<FileDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* ── Hidden admin routes (no Navbar / Footer) ── */}
          <Route
            path="/secure-admin-upload"
            element={
              <AdminRoute>
                <SecureAdminPage />
              </AdminRoute>
            }
          />
          <Route path="/secure-admin-upload/login" element={<SecureAdminLoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ── Redirect old admin paths so they don't 404 ── */}
          <Route path="/admin" element={<Navigate to="/secure-admin-upload" replace />} />
          <Route path="/admin/login" element={<Navigate to="/secure-admin-upload/login" replace />} />

          {/* ── All public pages (with Navbar + Footer) ── */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
