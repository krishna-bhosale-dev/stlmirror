import { Link } from 'react-router-dom'
import { Zap, Heart } from 'lucide-react'

const Footer = () => (
  <footer className="mt-20 border-t border-[var(--border-glass)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[var(--text-primary)]">
              STL<span className="gradient-text">_Mirror</span>
            </span>
          </Link>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
            A premium file sharing and download platform. Browse, search, and download files with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Browse
          </h4>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            {[
              { label: 'All Files', to: '/' },
              { label: 'Images', to: '/?category=images' },
              { label: 'Documents', to: '/?category=documents' },
              { label: 'Videos', to: '/?category=videos' },
              { label: 'Archives', to: '/?category=archives' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="hover:text-[var(--accent-primary)] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Platform
          </h4>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li>Updated daily with new files</li>
            <li>Secure direct downloads</li>
            <li>No registration required</li>
            <li>All file types supported</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border-glass)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} STL_Mirror. All rights reserved.
        </p>
        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
          Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for the community
        </p>
      </div>
    </div>
  </footer>
)

export default Footer
