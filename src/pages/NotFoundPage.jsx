import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center px-4 bg-grid">
    <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 max-w-md"
    >
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-[var(--border-glass)] flex items-center justify-center text-4xl">
          🔮
        </div>
      </div>

      <div>
        <h1 className="text-8xl font-black gradient-text mb-2">404</h1>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Page Not Found</h2>
        <p className="text-[var(--text-muted)] leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          id="notfound-home-btn"
          className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </motion.div>
  </div>
)

export default NotFoundPage
