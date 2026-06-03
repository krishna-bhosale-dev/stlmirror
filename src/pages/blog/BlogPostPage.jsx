import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Calendar, ChevronRight, BookOpen, Share2 } from 'lucide-react'
import { getPostBySlug, blogPosts } from '../../data/blogPosts'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import Badge from '../../components/common/Badge'
import AuthorBox from '../../components/blog/AuthorBox'
import { getFallbackImage, handleImageError } from '../../utils/fallbackImages'

const RelatedPostCard = ({ post }) => (
  <Link to={`/blog/${post.slug}`}
    className="card group flex gap-3 p-4 overflow-hidden">
    <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))' }}>
      <img
        src={post.thumbnail || getFallbackImage(post.category)}
        alt={post.title}
        loading="lazy"
        onError={(e) => handleImageError(e, post.category)}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <Badge category={post.category} size="xs">{post.category}</Badge>
      <p className="text-sm font-semibold mt-1 leading-snug line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors"
        style={{ color: 'var(--text-primary)' }}>
        {post.title}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{post.readTime}</p>
    </div>
  </Link>
)

const BlogPostPage = () => {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/blog" replace />

  const related = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)

  const ogImage = post.thumbnail || 'https://www.stlmirror.in/og-image.png'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author, url: 'https://www.stlmirror.in/about' },
    publisher: {
      '@type': 'Organization',
      name: 'STL Mirror',
      url: 'https://www.stlmirror.in',
      logo: { '@type': 'ImageObject', url: 'https://www.stlmirror.in/og-image.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.stlmirror.in/blog/${post.slug}` },
    image: ogImage,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.stlmirror.in' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.stlmirror.in/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.stlmirror.in/blog/${post.slug}` },
    ],
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={ogImage}
        structuredData={[structuredData, breadcrumbSchema]}
      />

      <div className="min-h-screen bg-grid">
        {/* Hero */}
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <Badge category={post.category}>{post.category}</Badge>
                {post.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" size="xs">{tag}</Badge>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5"
                style={{ color: 'var(--text-primary)' }}>
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  By {post.author}
                </span>
                <button onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={[
              { label: 'Blog', href: '/blog' },
              { label: post.category, href: `/blog?category=${post.category}` },
              { label: post.title },
            ]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            {/* Article */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {/* Thumbnail */}
              <div className="w-full h-52 sm:h-72 rounded-2xl mb-8 overflow-hidden relative" style={{ border: '1px solid var(--border-glass)' }}>
                <img
                  src={post.thumbnail || getFallbackImage(post.category)}
                  alt={post.title}
                  loading="eager"
                  decoding="async"
                  onError={(e) => handleImageError(e, post.category)}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <article
                className="prose-article"
                style={{
                  color: 'var(--text-secondary)',
                  '--prose-headings': 'var(--text-primary)',
                  '--prose-links': 'var(--accent-primary)',
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid var(--border-glass)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Tags:</span>
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" size="xs">#{tag}</Badge>
                ))}
              </div>

              {/* Author Box */}
              <AuthorBox articleCount={blogPosts.length} />
            </motion.div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Table of Contents stub */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                <h3 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  In This Article
                </h3>
                <ul className="space-y-1.5">
                  {['Introduction', 'Main Content', 'Comparison', 'FAQ', 'Conclusion'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Posts */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Related Articles
                  </h3>
                  <div className="space-y-3">
                    {related.map(p => <RelatedPostCard key={p.id} post={p} />)}
                  </div>
                </div>
              )}

              {/* Newsletter / CTA */}
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Explore Software</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Browse our curated software directory with reviews and download guides.
                </p>
                <Link to="/software"
                  className="btn-primary flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-semibold">
                  View Software Directory
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogPostPage
