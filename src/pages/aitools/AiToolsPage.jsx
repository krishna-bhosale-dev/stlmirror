import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Bot, BrainCircuit, Mic, PenTool, Video, Image as ImageIcon, Code, TrendingUp, ChevronRight, Search, Clock } from 'lucide-react'
import { aiToolsList, aiToolsCategories } from '../../data/aiToolsData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import Badge from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import { getFallbackImage, handleImageError } from '../../utils/fallbackImages'
import PageHero from '../../components/common/PageHero'

const POSTS_PER_PAGE = 6

const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'AI Writing': return PenTool;
    case 'AI Research': return BrainCircuit;
    case 'AI Coding': return Code;
    case 'AI Video': return Video;
    case 'AI Image Generation': return ImageIcon;
    case 'AI Voice': return Mic;
    case 'AI Productivity': return TrendingUp;
    default: return Bot;
  }
}

const getCategoryColor = (cat) => {
  switch (cat) {
    case 'AI Writing': return { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
    case 'AI Research': return { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' };
    case 'AI Coding': return { color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
    case 'AI Video': return { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' };
    case 'AI Image Generation': return { color: '#ec4899', bg: 'rgba(236,72,153,0.1)' };
    case 'AI Voice': return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    case 'AI Productivity': return { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' };
    default: return { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' };
  }
}

const ToolCard = ({ tool }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="card group overflow-hidden"
  >
    <div className="w-full h-44 relative overflow-hidden">
      <img
        src={tool.thumbnail || getFallbackImage(tool.category)}
        alt={tool.title}
        loading="lazy"
        decoding="async"
        onError={(e) => handleImageError(e, tool.category)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ display: 'block' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
    </div>

    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Badge category={tool.category}>{tool.category}</Badge>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Clock className="w-3 h-3" />
          {tool.readTime}
        </span>
      </div>

      <h2 className="font-bold leading-snug mb-2 text-base group-hover:text-[var(--accent-primary)] transition-colors"
        style={{ color: 'var(--text-primary)' }}>
        <Link to={`/ai-tools/${tool.slug}`}>{tool.title}</Link>
      </h2>

      <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
        {tool.excerpt}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {new Date(tool.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        <Link
          to={`/ai-tools/${tool.slug}`}
          className="flex items-center gap-1 text-xs font-semibold transition-colors hover:gap-2"
          style={{ color: 'var(--accent-primary)' }}
        >
          Read Review <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  </motion.article>
)

const AiToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    let tools = aiToolsList
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
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(1) }
  const handleSearch = (q) => { setSearchQuery(q); setCurrentPage(1) }

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
        title="AI Tools Directory — Best AI Generators & Assistants"
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
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'AI Tools' }]} />
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-14">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                id="ai-tools-search"
                type="text"
                placeholder="Search for AI tools (e.g. ChatGPT, Midjourney)..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm input-base"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}
              />
            </div>
          </div>

          {/* Category Cards (only show if no search) */}
          {!searchQuery && activeCategory === 'All' && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Browse by Discipline</h2>
                <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {aiToolsCategories.map(cat => {
                  const Icon = getCategoryIcon(cat)
                  const colors = getCategoryColor(cat)
                  const count = aiToolsList.filter(t => t.category === cat).length

                  return (
                    <button key={cat} onClick={() => handleCategory(cat)}
                      className="card group p-5 text-left flex flex-col transition-all hover:-translate-y-1">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                        style={{ background: colors.bg }}>
                        <Icon className="w-6 h-6" style={{ color: colors.color }} />
                      </div>
                      <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{cat}</h3>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {count} Tools
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* Category Pills Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-sm font-semibold mr-2" style={{ color: 'var(--text-primary)' }}>Filter:</span>
            {['All', ...aiToolsCategories].map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                style={activeCategory === cat
                  ? { background: 'var(--accent-gradient)', color: 'white', border: 'none' }
                  : { background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Info */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Showing {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </div>

          {/* Tool Grid */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(tool => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          ) : (
            <div className="py-20 text-center glass rounded-2xl">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No tools found</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search term or category filter.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-6 text-sm font-medium hover:underline" style={{ color: 'var(--accent-primary)' }}>
                Clear all filters
              </button>
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </>
  )
}

export default AiToolsPage
