import { motion } from 'framer-motion'

/**
 * PageHero — reusable hero banner for category/list pages
 */
const PageHero = ({ icon: Icon, badge, title, titleGradient, description, children, compact = false }) => (
  <section className={`relative overflow-hidden ${compact ? 'py-12 sm:py-16' : 'py-16 sm:py-24'}`}>
    {/* Background orbs */}
    <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5"
        >
          {Icon && <Icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />}
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{badge}</span>
        </motion.div>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`font-black tracking-tight mb-4 leading-tight ${compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl lg:text-6xl'}`}
      >
        {title && <span style={{ color: 'var(--text-primary)' }}>{title} </span>}
        {titleGradient && <span className="gradient-text">{titleGradient}</span>}
      </motion.h1>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </motion.p>
      )}

      {/* Extra content (search bars, buttons, etc.) */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          {children}
        </motion.div>
      )}
    </div>
  </section>
)

export default PageHero
