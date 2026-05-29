import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Search, Shield, Menu, X, Zap, LogOut } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../search/SearchBar'

const Navbar = ({ onSearch, searchQuery }) => {
  const { isDark, toggleTheme } = useTheme()
  const { isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false) // eslint-disable-line react-hooks/set-state-in-effect
  }, [location.pathname])

  const handleSearch = (q) => {
    if (onSearch) onSearch(q)
    if (location.pathname !== '/') navigate('/')
  }

  const handleAdminSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-strong shadow-2xl shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group" id="navbar-logo">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-30 blur transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }} />
              </div>
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                STL<span className="gradient-text">_Mirror</span>
              </span>
            </Link>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <SearchBar value={searchQuery || ''} onChange={handleSearch}
                placeholder="Search files, categories…" className="w-full" />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Mobile search toggle */}
              <button onClick={() => setShowSearch(p => !p)} id="mobile-search-btn"
                className="md:hidden p-2.5 rounded-xl transition-all"
                style={{ color: 'var(--text-muted)' }} aria-label="Toggle search">
                <Search className="w-5 h-5" />
              </button>

              {/* Theme toggle */}
              <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme} id="theme-toggle-btn"
                className="p-2.5 rounded-xl transition-all" style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle theme">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={isDark ? 'dark' : 'light'}
                    initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.15 }}>
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Admin badge — ONLY visible when logged in as admin */}
              {isAdmin && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/secure-admin-upload" id="admin-nav-btn"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: 'rgba(139,92,246,0.15)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      color: '#a78bfa',
                    }}>
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                  <button onClick={handleAdminSignOut}
                    className="p-2.5 rounded-xl transition-all" style={{ color: '#f87171' }}
                    aria-label="Sign out" title="Sign out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mobile hamburger — only show if admin (to reveal admin menu) */}
              {isAdmin && (
                <button onClick={() => setMobileOpen(p => !p)} id="mobile-menu-btn"
                  className="sm:hidden p-2.5 rounded-xl transition-all" style={{ color: 'var(--text-muted)' }}
                  aria-label="Toggle menu">
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden pb-3">
                <SearchBar value={searchQuery || ''} onChange={handleSearch} placeholder="Search files…" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile admin menu — only shown when admin is logged in */}
        <AnimatePresence>
          {mobileOpen && isAdmin && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong sm:hidden" style={{ borderTop: '1px solid var(--border-glass)' }}>
              <div className="px-4 py-4 space-y-2">
                <Link to="/secure-admin-upload"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    color: '#a78bfa',
                  }}>
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <button onClick={handleAdminSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                  style={{ color: '#f87171' }}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}

export default Navbar
