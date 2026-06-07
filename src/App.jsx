import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Existing pages
import HomePage from './pages/HomePage'
import FileDetailPage from './pages/FileDetailPage'
import SecureAdminPage from './pages/SecureAdminPage'
import SecureAdminLoginPage from './pages/SecureAdminLoginPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'

// Legal pages
import AboutPage from './pages/legal/AboutPage'
import ContactPage from './pages/legal/ContactPage'
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage'
import TermsPage from './pages/legal/TermsPage'
import DisclaimerPage from './pages/legal/DisclaimerPage'
import DmcaPage from './pages/legal/DmcaPage'
import EditorialPolicyPage from './pages/legal/EditorialPolicyPage'

// Blog pages
import BlogListPage from './pages/blog/BlogListPage'
import BlogPostPage from './pages/blog/BlogPostPage'

// AI Tools pages
import AiToolsPage from './pages/aitools/AiToolsPage'
import AiToolDetailPage from './pages/aitools/AiToolDetailPage'

// Software pages
import SoftwarePage from './pages/software/SoftwarePage'
import ApkPage from './pages/software/ApkPage'
import PdfToolsPage from './pages/software/PdfToolsPage'
import DevToolsPage from './pages/software/DevToolsPage'
import SoftwareDetailPage from './pages/software/SoftwareDetailPage'
import LatestSoftwarePage from './pages/software/LatestSoftwarePage'
import MostDownloadedPage from './pages/software/MostDownloadedPage'
import RecentlyUpdatedPage from './pages/software/RecentlyUpdatedPage'

// ─── Admin-Only Route Guard ───────────────────────────────────────────────────
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
          {/* ── Core ── */}
          <Route path="/" element={<HomePage externalSearch={globalSearch} />} />
          <Route path="/file/:id" element={<FileDetailPage />} />

          {/* ── Legal & Trust ── */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/dmca" element={<DmcaPage />} />
          <Route path="/editorial-policy" element={<EditorialPolicyPage />} />

          {/* ── Blog ── */}
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          {/* ── AI Tools Directory ── */}
          <Route path="/ai-tools" element={<AiToolsPage />} />
          <Route path="/ai-tools/:slug" element={<AiToolDetailPage />} />

          {/* ── Software Directory ── */}
          <Route path="/software" element={<SoftwarePage />} />
          <Route path="/software/:slug" element={<SoftwareDetailPage />} />
          <Route path="/apk" element={<ApkPage />} />
          <Route path="/pdf-tools" element={<PdfToolsPage />} />
          <Route path="/developer-tools" element={<DevToolsPage />} />
          <Route path="/latest" element={<LatestSoftwarePage />} />
          <Route path="/most-downloaded" element={<MostDownloadedPage />} />
          <Route path="/recently-updated" element={<RecentlyUpdatedPage />} />

          {/* ── 404 ── */}
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

          {/* ── Redirect old admin paths ── */}
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
