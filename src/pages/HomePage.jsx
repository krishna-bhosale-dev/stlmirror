import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, Files, Zap, ArrowDown } from 'lucide-react'
import { useFiles } from '../hooks/useFiles'
import FileGrid from '../components/files/FileGrid'
import CategoryFilter from '../components/filters/CategoryFilter'
import SearchBar from '../components/search/SearchBar'
import FileCard from '../components/files/FileCard'
import { FileSkeletonGrid } from '../components/files/FileSkeleton'
import { supabase } from '../config/supabase'

const StatBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
    <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
    <span className="text-sm text-[var(--text-secondary)]">{label}</span>
    <span className="text-sm font-bold text-[var(--text-primary)]">{value}</span>
  </div>
)

const HomePage = ({ externalSearch }) => {
  const {
    files,
    loading,
    error,
    hasMore,
    loadMore,
    trending,
    trendingLoading,
    totalCount,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
  } = useFiles()

  const [statsCount, setStatsCount] = useState({ total: 0 })

  // Sync navbar search into hook
  useEffect(() => {
    if (externalSearch !== undefined) {
      setSearchQuery(externalSearch)
    }
  }, [externalSearch]) // eslint-disable-line

  useEffect(() => {
    supabase.from('files').select('id', { count: 'exact', head: true }).then(({ count }) => {
      setStatsCount({ total: count || 0 })
    })
  }, [])

  const handleDownload = useCallback(() => {
    // Download logic is handled inside FileCard; this is just for analytics
  }, [])

  const isFiltered = searchQuery || category !== 'all'


  return (
    <div className="min-h-screen bg-grid">
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot" />
            <span className="text-sm text-[var(--text-secondary)] font-medium">
              Updated Daily · Free Downloads
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
          >
            <span className="text-[var(--text-primary)]">Your Premium</span>
            <br />
            <span className="gradient-text">File Mirror</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Browse, search, preview, and download files of every type.
            Images, documents, videos, archives — all in one place.
          </motion.p>

          {/* Hero search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for files, documents, images…"
              className="w-full text-base"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <StatBadge icon={Files} label="Total Files" value={statsCount.total} />
            <StatBadge icon={Zap} label="Instant" value="Downloads" />
            <StatBadge icon={TrendingUp} label="Updated" value="Daily" />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex justify-center"
          >
            <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
              <span className="text-xs uppercase tracking-widest">Explore</span>
              <ArrowDown className="w-4 h-4 float" />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ─── Trending ───────────────────────────────────────── */}
        {!isFiltered && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Trending Now
              </h2>
              <div className="flex-1 h-px bg-[var(--border-glass)]" />
            </div>

            {trendingLoading ? (
              <FileSkeletonGrid count={6} />
            ) : trending.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {trending.map((file) => (
                  <FileCard key={file.id} file={file} onDownload={handleDownload} />
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-muted)] text-sm">No trending files yet.</p>
            )}
          </section>
        )}

        {/* ─── Latest / Filtered Files ────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : category !== 'all'
                ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
                : 'Latest Uploads'}
            </h2>
            {totalCount > 0 && (
              <span className="ml-2 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded-full border border-[var(--border-glass)]">
                {totalCount} files
              </span>
            )}
            <div className="flex-1 h-px bg-[var(--border-glass)]" />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <CategoryFilter
              activeCategory={category}
              onCategoryChange={setCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          <FileGrid
            files={files}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onDownload={handleDownload}
            error={error}
          />
        </section>
      </div>
    </div>
  )
}

export default HomePage
