import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Breadcrumb — renders a breadcrumb trail + emits BreadcrumbList schema
 * items: [{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: 'Post Title' }]
 */
const Breadcrumb = ({ items = [] }) => {
  const allItems = [{ label: 'Home', href: '/' }, ...items]

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm">
      {allItems.map((item, i) => {
        const isLast = i === allItems.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i === 0 && <Home className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
            {isLast ? (
              <span
                className="font-medium truncate max-w-[200px]"
                style={{ color: 'var(--text-primary)' }}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:underline transition-colors truncate max-w-[150px]"
                style={{ color: 'var(--text-muted)' }}
              >
                {item.label}
              </Link>
            )}
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            )}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
