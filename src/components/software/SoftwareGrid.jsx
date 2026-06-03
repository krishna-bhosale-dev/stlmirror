import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Star, ChevronRight } from 'lucide-react'
import Badge from '../common/Badge'

/**
 * SoftwareGrid — reusable grid of software cards
 */
export const SoftwareGrid = ({ software }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {software.map((s, i) => (
      <motion.article
        key={s.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className="card group p-5"
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl font-black"
            style={{ background: 'var(--accent-gradient)', color: 'white' }}
          >
            {s.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm leading-snug mb-0.5" style={{ color: 'var(--text-primary)' }}>
              {s.name}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.developer}</p>
          </div>
        </div>

        <p className="text-xs mb-4 leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
          {s.description}
        </p>

        <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" style={{ color: '#fbbf24' }} />
            {s.rating}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {s.downloads}
          </span>
          <Badge category={s.category} size="xs">{s.subcategory}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={s.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-1 py-2 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
          <Link
            to={`/software/${s.slug}`}
            className="flex items-center justify-center gap-1 py-2 text-xs font-semibold rounded-xl transition-all"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.article>
    ))}
  </div>
)

export default SoftwareGrid
