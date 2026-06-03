import { Link } from 'react-router-dom'
import { Zap, Heart } from 'lucide-react'

const footerColumns = [
  {
    heading: 'Software',
    links: [
      { label: 'Software Hub', to: '/software' },
      { label: 'Android APKs', to: '/apk' },
      { label: 'PDF Tools', to: '/pdf-tools' },
      { label: 'Developer Tools', to: '/developer-tools' },
      { label: 'Latest Software', to: '/latest' },
      { label: 'Most Downloaded', to: '/most-downloaded' },
    ],
  },
  {
    heading: 'Content',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Editorial Policy', to: '/editorial-policy' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Disclaimer', to: '/disclaimer' },
      { label: 'DMCA Policy', to: '/dmca' },
    ],
  },
]

const Footer = () => (
  <footer className="mt-20" style={{ borderTop: '1px solid var(--border-glass)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5" id="footer-logo">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
              STL<span className="gradient-text">_Mirror</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '220px' }}>
            Your trusted source for software reviews, APK guides, developer tools, and expert tech tutorials.
          </p>
          <div className="flex flex-wrap gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Updated Daily
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              Expert Reviewed
            </span>
          </div>
        </div>

        {/* Column Groups */}
        {footerColumns.map(col => (
          <div key={col.heading} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
              {col.heading}
            </h4>
            <ul className="space-y-2">
              {col.links.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm transition-colors hover:text-[var(--accent-primary)]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
        style={{ borderTop: '1px solid var(--border-glass)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} STL_Mirror. All rights reserved. ·{' '}
          <Link to="/privacy-policy" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Privacy</Link>
          {' · '}
          <Link to="/terms" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Terms</Link>
          {' · '}
          <Link to="/dmca" className="hover:underline" style={{ color: 'var(--text-muted)' }}>DMCA</Link>
        </p>
        <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for the community
        </p>
      </div>
    </div>
  </footer>
)

export default Footer
