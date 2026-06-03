import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination component
 * currentPage: 1-indexed
 * totalPages: total number of pages
 * onPageChange: (page: number) => void
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  const left = Math.max(1, currentPage - delta)
  const right = Math.min(totalPages, currentPage + delta)

  if (left > 1) {
    pages.push(1)
    if (left > 2) pages.push('...')
  }
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < totalPages) {
    if (right < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }

  const btnBase =
    'w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all'

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          color: 'var(--text-secondary)',
        }}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm"
            style={{ color: 'var(--text-muted)' }}>
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={btnBase}
            style={
              page === currentPage
                ? { background: 'var(--accent-gradient)', color: 'white', border: 'none' }
                : {
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-secondary)',
                  }
            }
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          color: 'var(--text-secondary)',
        }}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}

export default Pagination
