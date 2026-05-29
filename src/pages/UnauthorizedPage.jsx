import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-grid relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(239,68,68,0.06)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(139,92,246,0.06)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        {/* Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(239,68,68,0.10)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
            <ShieldX className="w-10 h-10" style={{ color: '#f87171' }} />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-black mb-3"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Access Denied
        </motion.h1>

        <motion.p
          className="text-base mb-2"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          You don't have permission to access this area.
        </motion.p>

        <motion.p
          className="text-sm mb-8"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          This section is restricted to authorized administrators only.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            id="unauthorized-home-btn"
            onClick={() => navigate('/')}
            className="btn-primary flex items-center gap-2 px-6 py-3 text-sm font-semibold"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UnauthorizedPage
