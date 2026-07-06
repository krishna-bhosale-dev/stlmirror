import { useState } from 'react'
import { Search, Clock, Box } from 'lucide-react'
import { useFiles } from '../../hooks/useFiles'
import FileGrid from '../../components/files/FileGrid'
import CategoryFilter from '../../components/filters/CategoryFilter'
import SEOHead from '../../components/seo/SEOHead'
import PageHero from '../../components/common/PageHero'
import Breadcrumb from '../../components/common/Breadcrumb'

const StlFilesPage = () => {
  const {
    files,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
  } = useFiles()

  const handleDownload = () => {
    // Download logic is handled inside FileCard
  }

  const isFiltered = searchQuery || category !== 'all'

  return (
    <>
      <SEOHead
        title="STL Files Directory — Download Free 3D Models"
        description="Browse our vast collection of free STL files for 3D printing. High quality models updated daily."
        canonical="/stl-files"
      />

      <div className="min-h-screen bg-grid">
        <PageHero
          icon={Box}
          badge="STL Files"
          title="Download Premium"
          titleGradient="3D Models"
          description="Browse thousands of high-quality STL files for 3D printing. Characters, props, functional prints, and more."
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'STL Files' }]} />
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-14">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search STL files..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm input-base bg-[var(--bg-card)] border border-[var(--border-glass)]"
              />
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : category !== 'all'
                ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
                : 'All STL Files'}
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

          {/* Grid */}
          <FileGrid
            files={files}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onDownload={handleDownload}
            error={error}
          />
        </div>
      </div>
    </>
  )
}

export default StlFilesPage
