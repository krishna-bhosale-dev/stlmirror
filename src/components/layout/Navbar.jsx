import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun, Moon, Search, Shield, Menu, X, Zap, LogOut,
  ChevronDown, Smartphone, FileText, Code,
  TrendingUp, Clock, RefreshCw, Cpu, Box,
  Bot, Globe, Star, Bookmark, LayoutGrid,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../search/SearchBar'

/* ─── Static data ─────────────────────────────────────────────────── */

const softwareLinks = [
  { label: 'Software Hub',    href: '/software',          icon: Cpu,       desc: 'Browse all categories' },
  { label: 'Android APKs',   href: '/apk',               icon: Smartphone, desc: 'Emulators & Android apps' },
  { label: 'PDF Tools',      href: '/pdf-tools',          icon: FileText,  desc: 'Readers, editors & converters' },
  { label: 'Developer Tools',href: '/developer-tools',    icon: Code,      desc: 'IDEs, editors & utilities' },
]

const moreLinks = [
  { label: 'Latest Software',    href: '/latest',           icon: Clock },
  { label: 'Most Downloaded',    href: '/most-downloaded',  icon: TrendingUp },
  { label: 'Recently Updated',   href: '/recently-updated', icon: RefreshCw },
]

/**
 * resourceLinks — single source of truth for the Resources dropdown.
 * Add / remove items here to update both desktop dropdown & mobile accordion.
 */
const resourceLinks = [
  { label: 'AI Tools',         href: '/ai-tools',        icon: Bot,     desc: 'Discover curated AI tools' },
  { label: 'Android Apps',     href: '/apk',             icon: Smartphone, desc: 'Emulators & Android apps' },
  { label: 'Web Directory',    href: '/web-directory',   icon: Globe,   desc: 'Handpicked websites & links' },
  { label: 'Premium Files',    href: '/premium-files',   icon: Star,    desc: 'Exclusive premium downloads' },
  { label: 'Curated Websites', href: '/curated-websites',icon: Bookmark,desc: 'Bookmarks worth saving' },
]

/* ─── Reusable desktop dropdown shell ────────────────────────────── */

const Dropdown = ({ label, children, isOpen, onToggle, id }) => (
  <div className="relative">
    <button
      onClick={onToggle}
      id={id}
      className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all"
      style={{ color: 'var(--text-secondary)' }}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {label}
      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 mt-2 w-56 rounded-2xl overflow-hidden z-50 shadow-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

/* ─── Navbar ──────────────────────────────────────────────────────── */

const Navbar = ({ onSearch, searchQuery }) => {
  const { isDark, toggleTheme } = useTheme()
  const { isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isScrolled,     setIsScrolled]     = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [showSearch,     setShowSearch]     = useState(false)
  const [softwareOpen,   setSoftwareOpen]   = useState(false)
  const [moreOpen,       setMoreOpen]       = useState(false)
  const [resourcesOpen,  setResourcesOpen]  = useState(false)
  // Mobile accordion
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false)
    setSoftwareOpen(false)
    setMoreOpen(false)
    setResourcesOpen(false)
    setMobileResourcesOpen(false)
  }, [location.pathname])

  // Close desktop dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSoftwareOpen(false)
        setMoreOpen(false)
        setResourcesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (q) => {
    if (onSearch) onSearch(q)
    if (location.pathname !== '/') navigate('/')
  }

  const handleAdminSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLinkStyle  = { color: 'var(--text-secondary)' }
  const activeLinkStyle = { color: 'var(--accent-primary)' }
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  // True if any resource route is active (used to highlight the Resources button)
  const isResourceActive = resourceLinks.some(r => isActive(r.href))

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-strong shadow-2xl shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16" ref={dropdownRef}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" id="navbar-logo">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                STL<span className="gradient-text">_Mirror</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" id="nav-home"
                className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={isActive('/') && location.pathname === '/' ? activeLinkStyle : navLinkStyle}>
                Home
              </Link>

              <Link to="/stl-files" id="nav-stl-files"
                className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={isActive('/stl-files') ? activeLinkStyle : navLinkStyle}>
                STL Files
              </Link>

              <Link to="/blog" id="nav-blog"
                className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={isActive('/blog') ? activeLinkStyle : navLinkStyle}>
                Blog
              </Link>

              {/* Software Dropdown */}
              <Dropdown
                label="Software"
                id="nav-software-btn"
                isOpen={softwareOpen}
                onToggle={() => { setSoftwareOpen(p => !p); setMoreOpen(false); setResourcesOpen(false) }}
              >
                <div className="p-2">
                  {softwareLinks.map(link => (
                    <Link key={link.href} to={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(139,92,246,0.12)' }}>
                        <link.icon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{link.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Dropdown>

              {/* Categories Dropdown */}
              <Dropdown
                label="Categories"
                id="nav-categories-btn"
                isOpen={moreOpen}
                onToggle={() => { setMoreOpen(p => !p); setSoftwareOpen(false); setResourcesOpen(false) }}
              >
                <div className="p-2">
                  {moreLinks.map(link => (
                    <Link key={link.href} to={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <link.icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </Dropdown>

              {/* ── Resources Dropdown ── */}
              <Dropdown
                label="Resources"
                id="nav-resources-btn"
                isOpen={resourcesOpen}
                onToggle={() => { setResourcesOpen(p => !p); setSoftwareOpen(false); setMoreOpen(false) }}
              >
                <div className="p-2">
                  {resourceLinks.map(link => (
                    <Link
                      key={link.href}
                      to={link.href}
                      id={`nav-resource-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(139,92,246,0.12)' }}
                      >
                        <link.icon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{link.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Dropdown>

              <Link to="/contact" id="nav-contact"
                className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={isActive('/contact') ? activeLinkStyle : navLinkStyle}>
                Contact
              </Link>
            </nav>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-xs mx-4">
              <SearchBar value={searchQuery || ''} onChange={handleSearch}
                placeholder="Search files…" className="w-full" />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Mobile search toggle */}
              <button onClick={() => setShowSearch(p => !p)} id="mobile-search-btn"
                className="lg:hidden p-2.5 rounded-xl transition-all"
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

              {/* Admin badge */}
              {isAdmin && (
                <div className="hidden sm:flex items-center gap-1.5">
                  <Link to="/secure-admin-upload" id="admin-nav-btn"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
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

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(p => !p)} id="mobile-menu-btn"
                className="lg:hidden p-2.5 rounded-xl transition-all" style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle menu">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden pb-3">
                <SearchBar value={searchQuery || ''} onChange={handleSearch} placeholder="Search files…" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong lg:hidden" style={{ borderTop: '1px solid var(--border-glass)' }}>
              <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
                {[
                  { label: 'Home',             href: '/' },
                  { label: 'STL Files',        href: '/stl-files' },
                  { label: 'Blog',             href: '/blog' },
                  { label: 'Software Hub',     href: '/software' },
                  { label: 'Android APKs',     href: '/apk' },
                  { label: 'PDF Tools',        href: '/pdf-tools' },
                  { label: 'Developer Tools',  href: '/developer-tools' },
                  { label: 'Latest Software',  href: '/latest' },
                  { label: 'Most Downloaded',  href: '/most-downloaded' },
                  { label: 'About Us',         href: '/about' },
                  { label: 'Contact',          href: '/contact' },
                ].map(item => (
                  <Link key={item.href} to={item.href}
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: isActive(item.href) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      background: isActive(item.href) ? 'rgba(139,92,246,0.08)' : 'transparent',
                    }}>
                    {item.label}
                  </Link>
                ))}

                {/* ── Resources accordion ── */}
                <div>
                  <button
                    id="mobile-resources-btn"
                    onClick={() => setMobileResourcesOpen(p => !p)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: isResourceActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      background: isResourceActive ? 'rgba(139,92,246,0.08)' : 'transparent',
                    }}
                    aria-expanded={mobileResourcesOpen}
                  >
                    <span className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      Resources
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {mobileResourcesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 ml-3 pl-3 space-y-0.5" style={{ borderLeft: '2px solid var(--border-glass)' }}>
                          {resourceLinks.map(link => (
                            <Link
                              key={link.href}
                              to={link.href}
                              id={`mobile-resource-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                              style={{
                                color: isActive(link.href) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                background: isActive(link.href) ? 'rgba(139,92,246,0.08)' : 'transparent',
                              }}
                            >
                              <link.icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Admin links */}
                {isAdmin && (
                  <>
                    <Link to="/secure-admin-upload"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: '#a78bfa' }}>
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                    <button onClick={handleAdminSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
                      style={{ color: '#f87171' }}>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                )}
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
