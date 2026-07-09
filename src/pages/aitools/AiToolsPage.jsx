import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Bot, BrainCircuit, Mic, PenTool, Video,
  Image as ImageIcon, Code, TrendingUp, ChevronRight,
  Search, Clock, ArrowUpRight,
} from 'lucide-react'
import { aiToolsList, aiToolsCategories } from '../../data/aiToolsData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import Badge from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import { getFallbackImage, handleImageError } from '../../utils/fallbackImages'
import PageHero from '../../components/common/PageHero'

const POSTS_PER_PAGE = 6

/* ── Category helpers ────────────────────────────────────────────── */
const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'AI Writing':           return PenTool
    case 'AI Research':          return BrainCircuit
    case 'AI Coding':            return Code
    case 'AI Video':             return Video
    case 'AI Image Generation':  return ImageIcon
    case 'AI Voice':             return Mic
    case 'AI Productivity':      return TrendingUp
    default:                     return Bot
  }
}

const getCategoryColor = (cat) => {
  switch (cat) {
    case 'AI Writing':           return { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' }
    case 'AI Research':          return { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' }
    case 'AI Coding':            return { color: '#10b981', bg: 'rgba(16,185,129,0.1)' }
    case 'AI Video':             return { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' }
    case 'AI Image Generation':  return { color: '#ec4899', bg: 'rgba(236,72,153,0.1)' }
    case 'AI Voice':             return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }
    case 'AI Productivity':      return { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' }
    default:                     return { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' }
  }
}

/* ── ToolCard ────────────────────────────────────────────────────── */
const ToolCard = ({ tool }) => {
  const colors = getCategoryColor(tool.category)
  const CategoryIcon = getCategoryIcon(tool.category)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-glow)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(139,92,246,0.12)'
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-glass)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden" style={{ height: '168px', background: 'var(--bg-secondary)' }}>
        <img
          src={tool.thumbnail || getFallbackImage(tool.category)}
          alt={tool.logoAlt || (tool.name ? `${tool.name} logo` : tool.title)}
          loading="lazy"
          decoding="async"
          onError={(e) => handleImageError(e, tool.category)}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ padding: '20px', display: 'block' }}
        />
        {/* Gradient fade at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-card), transparent)' }}
        />
        {/* Category accent dot */}
        <div
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ background: colors.color, boxShadow: `0 0 8px ${colors.color}` }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Category badge + read time */}
        <div className="flex items-center justify-between">
          <Badge category={tool.category}>{tool.category}</Badge>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <Clock className="w-3 h-3 flex-shrink-0" />
            {tool.readTime}
          </span>
        </div>

        {/* Tool icon + title row */}
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
            style={{ background: colors.bg }}
          >
            <CategoryIcon className="w-4 h-4" style={{ color: colors.color }} />
          </div>
          <h2
            className="font-bold text-base leading-snug transition-colors duration-200 group-hover:text-[var(--accent-primary)]"
            style={{ color: 'var(--text-primary)' }}
          >
            <Link to={`/ai-tools/${tool.slug}`} className="outline-none focus-visible:underline">
              {tool.title}
            </Link>
          </h2>
        </div>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed line-clamp-2 flex-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {tool.excerpt}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3 mt-auto"
          style={{ borderTop: '1px solid var(--border-glass)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {new Date(tool.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </span>

          <Link
            to={`/ai-tools/${tool.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all duration-200"
            style={{
              color: 'var(--accent-primary)',
              background: 'var(--accent-glow)',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(139,92,246,0.2)'
              e.currentTarget.style.borderColor = 'var(--border-glow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--accent-glow)'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            Read Review
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

/* ── CategoryCard ────────────────────────────────────────────────── */
const CategoryCard = ({ cat, count, onClick }) => {
  const Icon = getCategoryIcon(cat)
  const colors = getCategoryColor(cat)

  return (
    <button
      onClick={onClick}
      className="group text-left flex items-center gap-4 p-4 rounded-xl transition-all duration-250"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = colors.color + '55'
        e.currentTarget.style.background = colors.bg
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-glass)'
        e.currentTarget.style.background = 'var(--bg-card)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-250 group-hover:scale-110"
        style={{ background: colors.bg }}
      >
        <Icon className="w-5 h-5" style={{ color: colors.color }} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{cat}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{count} tool{count !== 1 ? 's' : ''}</p>
      </div>
    </button>
  )
}

/* ── Sorted tools (once, at module level) ───────────────────────── */
const sortedTools = [...aiToolsList].sort((a, b) => new Date(b.date) - new Date(a.date))

/* ── Page ────────────────────────────────────────────────────────── */
const AiToolsPage = () => {
  const [searchQuery, setSearchQuery]     = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage]     = useState(1)

  const filtered = useMemo(() => {
    let tools = sortedTools
    if (activeCategory !== 'All') tools = tools.filter(t => t.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      tools = tools.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.excerpt.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }
    return tools
  }, [searchQuery, activeCategory])

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const paginated  = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(1) }
  const handleSearch   = (q)   => { setSearchQuery(q);    setCurrentPage(1) }

  const isFiltering = searchQuery.trim() !== '' || activeCategory !== 'All'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Tools Directory — STL Mirror',
    url: 'https://www.stlmirror.in/ai-tools',
    description: 'Discover the best AI tools for writing, coding, video generation, and productivity. Read our expert reviews.',
  }

  return (
    <>
      <SEOHead
        title="AI Tools Directory — Best AI Generators & Assistants 2026"
        description="Discover the best AI tools for writing, coding, video generation, and productivity. Read our in-depth reviews and find the right AI for your workflow."
        canonical="/ai-tools"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-grid">
        <PageHero
          icon={Sparkles}
          badge="AI Tools"
          title="Discover the Best"
          titleGradient="AI Tools"
          description="Explore our curated collection of artificial intelligence tools. We test and review the leading AI writing assistants, image generators, and productivity boosters."
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'AI Tools' }]} />
          </div>

          {/* ── Search Bar ───────────────────────────────────────── */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                id="ai-tools-search"
                type="text"
                placeholder="Search AI tools (e.g. ChatGPT, Midjourney)…"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm input-base"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                }}
              />
            </div>
          </div>

          {/* ── Browse by Category (only when not filtering) ──────── */}
          {!isFiltering && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Browse by Category
                </h2>
                <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {aiToolsCategories.map(cat => (
                  <CategoryCard
                    key={cat}
                    cat={cat}
                    count={aiToolsList.filter(t => t.category === cat).length}
                    onClick={() => handleCategory(cat)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Section Header ────────────────────────────────────── */}
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {isFiltering ? 'Search Results' : 'All AI Tools'}
            </h2>
            <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
          </div>

          {/* ── Category Filter Pills ─────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {['All', ...aiToolsCategories].map(cat => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: 'var(--accent-gradient)',
                          color: 'white',
                          border: '1px solid transparent',
                          boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
                        }
                      : {
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--text-secondary)',
                        }
                  }
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* ── Results count ─────────────────────────────────────── */}
          <div className="mb-6">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing{' '}
              <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {filtered.length}
              </span>{' '}
              tool{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </div>

          {/* ── Tool Grid ─────────────────────────────────────────── */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {paginated.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div
              className="py-20 text-center rounded-2xl"
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(139,92,246,0.1)' }}
              >
                <Bot className="w-8 h-8 opacity-60" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                No tools found
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Try adjusting your search term or category filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: 'var(--accent-gradient)',
                  color: 'white',
                }}
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* ── Pagination ────────────────────────────────────────── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  )
}

export default AiToolsPage
