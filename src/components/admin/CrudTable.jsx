import { useState } from 'react'
import { Edit2, Trash2, CheckCircle, XCircle, Search, Star, ExternalLink, Image as ImageIcon } from 'lucide-react'

/**
 * Reusable table for displaying admin records.
 */
const CrudTable = ({
  items,
  loading,
  columns, // Array of { key, label, render }
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
  page,
  setPage,
  totalCount,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onAddNew,
  addButtonText = 'Add New'
}) => {

  const totalPages = Math.ceil(totalCount / 15)

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* ─── Controls ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base w-full pl-9 pr-4 py-2 text-sm"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-base py-2 px-3 text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        {onAddNew && (
          <button onClick={onAddNew} className="btn-primary py-2 px-4 whitespace-nowrap text-sm w-full sm:w-auto">
            {addButtonText}
          </button>
        )}
      </div>

      {/* ─── Table ───────────────────────────────────────────────────────────── */}
      <div className="glass rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-glass)] text-[var(--text-muted)]">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
                ))}
                {(onToggleFeatured || onToggleStatus) && <th className="px-4 py-3 font-medium">Status</th>}
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-glass)] text-[var(--text-secondary)]">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    <div className="animate-pulse flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-t-[var(--accent-primary)] animate-spin" />
                      Loading data...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-[var(--text-muted)]">
                    No items found matching your criteria.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-secondary)] transition-colors group">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                    
                    {/* Status Column */}
                    {(onToggleFeatured || onToggleStatus) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {onToggleStatus && (
                            <button
                              onClick={() => onToggleStatus(item.id, item.status)}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors
                                ${item.status === 'published' 
                                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                                  : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                                }`}
                            >
                              {item.status === 'published' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                              {item.status === 'published' ? 'Published' : 'Draft'}
                            </button>
                          )}
                          {onToggleFeatured && (
                            <button
                              onClick={() => onToggleFeatured(item.id, item.is_featured)}
                              className={`p-1 rounded transition-colors
                                ${item.is_featured 
                                  ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' 
                                  : 'text-[var(--text-muted)] hover:text-yellow-400 hover:bg-[var(--bg-primary)]'
                                }`}
                              title="Toggle Featured"
                            >
                              <Star className={`w-4 h-4 ${item.is_featured ? 'fill-current' : ''}`} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Actions Column */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Pagination ──────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-[var(--text-muted)]">
            Showing {items.length > 0 ? page * 15 + 1 : 0} to {Math.min((page + 1) * 15, totalCount)} of {totalCount}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-glass)] disabled:opacity-50 hover:bg-[var(--bg-card)] transition-colors"
            >
              Prev
            </button>
            <span className="text-[var(--text-primary)] font-medium">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-glass)] disabled:opacity-50 hover:bg-[var(--bg-card)] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Icon helper for status button
const Clock = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

export default CrudTable
