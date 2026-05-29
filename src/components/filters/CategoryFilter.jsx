import { motion } from 'framer-motion'
import { Image, FileText, Film, Archive, Smartphone, Star, LayoutGrid, SortAsc, TrendingDown } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'All Files', Icon: LayoutGrid },
  { id: 'images', label: 'Images', Icon: Image },
  { id: 'documents', label: 'Documents', Icon: FileText },
  { id: 'videos', label: 'Videos', Icon: Film },
  { id: 'archives', label: 'Archives', Icon: Archive },
  { id: 'apps', label: 'Apps', Icon: Smartphone },
  { id: 'featured', label: 'Featured', Icon: Star },
]

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First', Icon: SortAsc },
  { id: 'downloads', label: 'Most Downloaded', Icon: TrendingDown },
  { id: 'size', label: 'Largest First' },
]

const CategoryFilter = ({ activeCategory, onCategoryChange, sortBy, onSortChange }) => {
  return (
    <div className="space-y-4">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ id, label, Icon }) => {
          const isActive = activeCategory === id
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(id)}
              id={`filter-${id}`}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                border transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'pill-active shadow-lg'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-glass)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </motion.button>
          )
        })}
      </div>

      {/* Sort options */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
          Sort:
        </span>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map(({ id, label }) => {
            const isActive = sortBy === id
            return (
              <button
                key={id}
                onClick={() => onSortChange(id)}
                id={`sort-${id}`}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                  ${isActive
                    ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]/40 text-[var(--accent-primary)]'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoryFilter
