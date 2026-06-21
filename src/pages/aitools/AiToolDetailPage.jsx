import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Calendar, ChevronRight, Share2, Sparkles, ExternalLink, Globe, Code2, DollarSign, Zap } from 'lucide-react'
import { getAiToolBySlug, aiToolsList } from '../../data/aiToolsData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import Badge from '../../components/common/Badge'
import { getFallbackImage, handleImageError } from '../../utils/fallbackImages'

const RelatedToolCard = ({ tool }) => (
  <Link to={`/ai-tools/${tool.slug}`}
    className="card group flex gap-3 p-4 overflow-hidden">
    <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))' }}>
      <img
        src={tool.thumbnail || getFallbackImage(tool.category)}
        alt={tool.logoAlt || (tool.name ? `${tool.name} logo` : tool.title)}
        loading="lazy"
        onError={(e) => handleImageError(e, tool.category)}
        className="w-full h-full object-contain p-2"
        style={{ background: 'var(--bg-card)' }}
      />
    </div>
    <div className="flex-1 min-w-0">
      <Badge category={tool.category} size="xs">{tool.category}</Badge>
      <p className="text-sm font-semibold mt-1 leading-snug line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors"
        style={{ color: 'var(--text-primary)' }}>
        {tool.title}
      </p>
    </div>
  </Link>
)

const AiToolDetailPage = () => {
  const { slug } = useParams()
  const tool = getAiToolBySlug(slug)

  if (!tool) return <Navigate to="/ai-tools" replace />

  const related = aiToolsList
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3)

  const ogImage = tool.thumbnail || 'https://www.stlmirror.in/og-image.png'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    applicationCategory: tool.category,
    description: tool.excerpt,
    datePublished: tool.date,
    ...(tool.website ? { url: tool.website } : {}),
    ...(tool.developer ? { author: { '@type': 'Organization', name: tool.developer } } : { author: { '@type': 'Organization', name: 'STL Mirror Editorial Team', url: 'https://www.stlmirror.in/about' } }),
    publisher: {
      '@type': 'Organization',
      name: 'STL Mirror',
      url: 'https://www.stlmirror.in',
      logo: { '@type': 'ImageObject', url: 'https://www.stlmirror.in/og-image.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.stlmirror.in/ai-tools/${tool.slug}` },
    image: ogImage,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.stlmirror.in' },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: 'https://www.stlmirror.in/ai-tools' },
      { '@type': 'ListItem', position: 3, name: tool.title, item: `https://www.stlmirror.in/ai-tools/${tool.slug}` },
    ],
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: tool.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      <SEOHead
        title={tool.title}
        description={tool.excerpt}
        canonical={`/ai-tools/${tool.slug}`}
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
                <Badge category={tool.category}>
                  <Sparkles className="w-3 h-3 mr-1 inline" />
                  {tool.category}
                </Badge>
                {tool.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" size="xs">#{tag}</Badge>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5"
                style={{ color: 'var(--text-primary)' }}>
                {tool.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Calendar className="w-4 h-4" />
                  {new Date(tool.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Clock className="w-4 h-4" />
                  {tool.readTime}
                </span>
                <button onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>

              {/* Official Website CTA */}
              {tool.website && (
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`visit-official-${tool.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'var(--accent-gradient)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
                  }}
                >
                  <Globe className="w-4 h-4" />
                  Visit Official Website
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={[
              { label: 'AI Tools', href: '/ai-tools' },
              { label: tool.category },
              { label: tool.title },
            ]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            {/* Article */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {/* Logo */}
              <div className="w-full h-52 sm:h-72 rounded-2xl mb-8 overflow-hidden relative flex items-center justify-center" style={{ border: '1px solid var(--border-glass)', background: 'var(--bg-card)' }}>
                <img
                  src={tool.thumbnail || getFallbackImage(tool.category)}
                  alt={tool.logoAlt || (tool.name ? `${tool.name} logo` : tool.title)}
                  loading="eager"
                  decoding="async"
                  onError={(e) => handleImageError(e, tool.category)}
                  className="max-w-[60%] max-h-[60%] object-contain"
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
                dangerouslySetInnerHTML={{ __html: tool.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid var(--border-glass)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Tags:</span>
                {tool.tags.map(tag => (
                  <Badge key={tag} variant="outline" size="xs">#{tag}</Badge>
                ))}
              </div>
            </motion.div>

            {/* Sidebar */}
            <aside className="space-y-6">

              {/* Official Website Card */}
              {tool.website && (
                <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <h3 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Official Website
                  </h3>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Visit the official {tool.title.split(' ')[0]} website to access all features, pricing, documentation, and support resources.
                  </p>
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`sidebar-official-${tool.slug}`}
                    className="flex items-center gap-2 text-xs font-semibold mb-3 break-all"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                    {tool.website.replace('https://', '')}
                  </a>
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'var(--accent-gradient)', color: 'white' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Official Site
                  </a>
                </div>
              )}

              {/* Tool Metadata Card */}
              {(tool.developer || tool.pricing || tool.primaryUse) && (
                <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                  <h3 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Tool Info
                  </h3>
                  <div className="space-y-3">
                    {tool.category && (
                      <div className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Category</p>
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{tool.category}</p>
                        </div>
                      </div>
                    )}
                    {tool.developer && (
                      <div className="flex items-start gap-2">
                        <Code2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Developer</p>
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{tool.developer}</p>
                        </div>
                      </div>
                    )}
                    {tool.pricing && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Pricing</p>
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{tool.pricing}</p>
                        </div>
                      </div>
                    )}
                    {tool.primaryUse && (
                      <div className="flex items-start gap-2">
                        <Globe className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Primary Use</p>
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{tool.primaryUse}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Table of Contents */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                <h3 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Review Sections
                </h3>
                <ul className="space-y-1.5">
                  {['Introduction', 'Key Features', 'Pros and Cons', 'Best Use Cases', 'Pricing', 'Alternatives', 'Verdict'].map(item => (
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
                    Similar AI Tools
                  </h3>
                  <div className="space-y-3">
                    {related.map(t => <RelatedToolCard key={t.id} tool={t} />)}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default AiToolDetailPage
