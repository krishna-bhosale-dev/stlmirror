import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Search, BookOpen, ChevronRight, Star } from 'lucide-react'
import { blogPosts, categories } from '../../data/blogPosts'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import Badge from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'

const POSTS_PER_PAGE = 6

const PostCard = ({ post, featured = false }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={`card group overflow-hidden ${featured ? 'sm:col-span-2 lg:col-span-2' : ''}`}
  >
    {/* Thumbnail placeholder */}
    <div
      className={`w-full ${featured ? 'h-52 sm:h-64' : 'h-40'} flex items-center justify-center relative overflow-hidden`}
      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))' }}
    >
      <BookOpen className="w-10 h-10 opacity-20" style={{ color: 'var(--accent-primary)' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
    </div>

    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Badge category={post.category}>{post.category}</Badge>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Clock className="w-3 h-3" />
          {post.readTime}
        </span>
        {post.featured && (
          <span className="flex items-center gap-1 text-xs" style={{ color: '#fbbf24' }}>
            <Star className="w-3 h-3 fill-current" />
            Featured
          </span>
        )}
      </div>

      <h2 className={`font-bold leading-snug mb-2 group-hover:text-[var(--accent-primary)] transition-colors ${featured ? 'text-xl' : 'text-base'}`}
        style={{ color: 'var(--text-primary)' }}>
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>

      <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        <Link
          to={`/blog/${post.slug}`}
          className="flex items-center gap-1 text-xs font-semibold transition-colors hover:gap-2"
          style={{ color: 'var(--accent-primary)' }}
        >
          Read More <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  </motion.article>
)

const BlogListPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    let posts = blogPosts
    if (activeCategory !== 'All') posts = posts.filter(p => p.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return posts
  }, [searchQuery, activeCategory])

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
  const featuredPost = blogPosts.find(p => p.featured)

  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(1) }
  const handleSearch = (q) => { setSearchQuery(q); setCurrentPage(1) }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'STL Mirror Blog',
    url: 'https://www.stlmirror.in/blog',
    description: 'Software guides, tutorials, and reviews from the STL Mirror editorial team.',
    publisher: { '@type': 'Organization', name: 'STL Mirror', url: 'https://www.stlmirror.in' },
  }

  return (
    <>
      <SEOHead
        title="Blog — Software Guides, Reviews & Tutorials"
        description="Read expert software guides, in-depth reviews, Android tutorials, developer tips, and productivity advice on the STL Mirror Blog."
        canonical="/blog"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-grid">
        {/* Hero */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5">
              <BookOpen className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>STL Mirror Blog</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              <span style={{ color: 'var(--text-primary)' }}>Software Guides</span>
              <br />
              <span className="gradient-text">&amp; Expert Reviews</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
              {blogPosts.length} in-depth articles on Android apps, developer tools, productivity, and more — written by our expert team.
            </motion.p>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="blog-search"
                  type="text"
                  placeholder="Search articles, topics, tools…"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm input-base"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Blog' }]} />
          </div>

          {/* Featured Hero Post */}
          {!searchQuery && activeCategory === 'All' && featuredPost && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <Star className="w-5 h-5" style={{ color: '#fbbf24' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Featured Article</h2>
                <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
              </div>
              <Link to={`/blog/${featuredPost.slug}`} className="block">
                <div className="card group overflow-hidden sm:flex">
                  <div className="sm:w-2/5 h-52 sm:h-auto flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.15))' }}>
                    <BookOpen className="w-16 h-16 opacity-30" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge category={featuredPost.category}>{featuredPost.category}</Badge>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <Clock className="w-3 h-3" />{featuredPost.readTime}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent-primary)] transition-colors"
                        style={{ color: 'var(--text-primary)' }}>
                        {featuredPost.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
                        Read Article <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['All', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={activeCategory === cat
                  ? { background: 'var(--accent-gradient)', color: 'white', border: 'none' }
                  : { background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''}{searchQuery ? ` for "${searchQuery}"` : ''}
            </p>
          </div>

          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No articles found</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try a different search term or category</p>
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </>
  )
}

export default BlogListPage
