import { motion, AnimatePresence } from 'framer-motion'
import FileCard from './FileCard'
import { FileSkeletonGrid } from './FileSkeleton'
import { FolderOpen, RefreshCw } from 'lucide-react'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const FileGrid = ({ files, loading, hasMore, onLoadMore, onDownload, error }) => {
  if (loading && files.length === 0) return <FileSkeletonGrid count={8} />

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
          <RefreshCw className="w-10 h-10 text-red-400" />
        </div>
        <p className="text-[var(--text-primary)] font-semibold text-lg">Something went wrong</p>
        <p className="text-[var(--text-muted)] text-sm max-w-sm">{error}</p>
      </div>
    )
  }

  if (!loading && files.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-glass)]">
          <FolderOpen className="w-12 h-12 text-[var(--text-muted)]" />
        </div>
        <p className="text-[var(--text-primary)] font-semibold text-xl">No files found</p>
        <p className="text-[var(--text-muted)] text-sm max-w-sm">
          Try adjusting your search query or filters. New files are added daily!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {files.map((file) => (
            <FileCard key={file.id} file={file} onDownload={onDownload} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="btn-primary flex items-center gap-2 px-8 py-3 text-sm disabled:opacity-50"
            id="load-more-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Load More
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default FileGrid
