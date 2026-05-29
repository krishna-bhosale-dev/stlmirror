import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isAdminEmail } from '../config/supabase'

// ─── Animated Particle ────────────────────────────────────────────────────────
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{
      y: [0, -30, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: style.duration,
      repeat: Infinity,
      delay: style.delay,
      ease: 'easeInOut',
    }}
  />
)

const particles = Array.from({ length: 18 }, (_, i) => ({
  width: `${Math.random() * 6 + 2}px`,
  height: `${Math.random() * 6 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  background: i % 3 === 0
    ? 'rgba(139,92,246,0.6)'
    : i % 3 === 1
    ? 'rgba(6,182,212,0.5)'
    : 'rgba(236,72,153,0.4)',
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 3,
}))

// ─── Input Field ──────────────────────────────────────────────────────────────
const InputField = ({ id, label, type, value, onChange, placeholder, icon: Icon, rightSlot, autoComplete }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-xs font-semibold tracking-widest uppercase"
      style={{ color: 'var(--text-muted)' }}>
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors"
        style={{ color: 'var(--text-muted)' }} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="input-base w-full pl-11 pr-12 py-3.5 text-sm"
        style={{ fontSize: '15px' }}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  </div>
)

// ─── Main Login Page ──────────────────────────────────────────────────────────
const SecureAdminLoginPage = () => {
  const navigate = useNavigate()
  const { signIn, isAdmin, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if already admin
  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/secure-admin-upload', { replace: true })
    }
  }, [isAdmin, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setFormLoading(true)
    setError(null)

    const { data, error: authError } = await signIn(email, password)

    if (authError) {
      setError(authError.message || 'Invalid credentials. Please try again.')
      setFormLoading(false)
      return
    }

    // Email gate — even if Supabase auth succeeds, check if it's the admin
    if (!isAdminEmail(data?.user?.email)) {
      // Sign them out immediately — they're not the admin
      await import('../config/supabase').then(m => m.supabase.auth.signOut())
      setError('Access denied. This portal is restricted to authorized administrators only.')
      setFormLoading(false)
      return
    }

    navigate('/secure-admin-upload', { replace: true })
    setFormLoading(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>

      {/* ── Animated gradient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)' }}
          animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)' }}
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </div>

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => <Particle key={i} style={p} />)}
      </div>

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* ── Login card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Card glow ring */}
        <div className="absolute -inset-0.5 rounded-2xl opacity-40 blur-sm"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.5), rgba(6,182,212,0.3))' }} />

        <div className="relative card p-8 space-y-7 overflow-hidden"
          style={{ borderRadius: '20px', background: 'rgba(13, 13, 20, 0.90)', backdropFilter: 'blur(40px)' }}>

          {/* Inner shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(6,182,212,0.4), transparent)' }} />

          {/* ── Header ── */}
          <div className="text-center space-y-4">
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}>
                  <Shield className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-0"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', filter: 'blur(12px)' }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Admin Portal
              </h1>
              <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Authorized access only · STL_Mirror
              </p>
            </motion.div>
          </div>

          {/* ── Error ── */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="flex items-start gap-3 p-3.5 rounded-xl text-sm"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171',
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Form ── */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <InputField
              id="admin-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              placeholder="admin@example.com"
              icon={Mail}
              autoComplete="email"
            />

            <InputField
              id="admin-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null) }}
              placeholder="••••••••••"
              icon={Lock}
              autoComplete="current-password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Submit button */}
            <button
              type="submit"
              id="secure-admin-login-btn"
              disabled={formLoading || !email || !password}
              className="btn-primary w-full flex items-center justify-center gap-2.5 py-4 text-sm font-bold tracking-wide mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '12px', fontSize: '15px', letterSpacing: '0.02em' }}
            >
              {formLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>

          {/* ── Footer note ── */}
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              🔒 This page is not publicly linked. Unauthorized access attempts are logged.
            </p>
          </div>

          {/* Bottom shimmer line */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)' }} />
        </div>
      </motion.div>
    </div>
  )
}

export default SecureAdminLoginPage
