import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Star, Calendar, HardDrive, Monitor, ExternalLink, CheckCircle, ChevronRight } from 'lucide-react'
import { getSoftwareBySlug, getRelatedSoftware } from '../../data/softwareData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import Badge from '../../components/common/Badge'

const SoftwareDetailPage = () => {
  const { slug } = useParams()
  const software = getSoftwareBySlug(slug)

  if (!software) return <Navigate to="/software" replace />

  const related = getRelatedSoftware(software.relatedSlugs || [])

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: software.name,
    applicationCategory: software.subcategory,
    operatingSystem: software.platform.join(', '),
    description: software.description,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: software.rating,
      bestRating: 5,
      ratingCount: 1000,
    },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    url: software.downloadUrl,
    author: { '@type': 'Organization', name: software.developer },
  }

  return (
    <>
      <SEOHead
        title={`${software.name} — Download, Review & Guide`}
        description={`${software.description} Version ${software.version}. Free download with step-by-step installation guide, system requirements, and FAQs.`}
        canonical={`/software/${software.slug}`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-grid">
        {/* Hero */}
        <section className="relative py-12 sm:py-16 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start gap-6">
              {/* App icon */}
              <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl font-black shadow-xl"
                style={{ background: 'var(--accent-gradient)', color: 'white' }}>
                {software.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge category={software.category}>{software.category}</Badge>
                  <Badge variant="outline" size="xs">{software.subcategory}</Badge>
                  <Badge variant="outline" size="xs">{software.license}</Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                  {software.name}
                </h1>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{software.longDescription}</p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-4 mb-5">
                  {[
                    { icon: Star, value: `${software.rating}/5`, label: 'Rating', color: '#fbbf24' },
                    { icon: Download, value: software.downloads, label: 'Downloads', color: 'var(--accent-secondary)' },
                    { icon: HardDrive, value: software.size, label: 'Size', color: 'var(--accent-primary)' },
                    { icon: Calendar, value: software.version, label: 'Version', color: '#22c55e' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Download & Official Site */}
                <div className="flex flex-wrap gap-3">
                  <a href={software.downloadUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2 px-6 py-3 text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    Download {software.name}
                  </a>
                  <a href={software.officialSite} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                    <ExternalLink className="w-4 h-4" />
                    Official Site
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[
              { label: 'Software', href: '/software' },
              { label: software.category, href: `/${software.category === 'APK' ? 'apk' : software.category === 'PDF Tools' ? 'pdf-tools' : 'developer-tools'}` },
              { label: software.name },
            ]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            {/* Main */}
            <div className="space-y-8">
              {/* Screenshots */}
              {software.screenshots?.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Screenshots</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {software.screenshots.map((src, i) => (
                      <img key={i} src={src} alt={`${software.name} screenshot ${i + 1}`}
                        className="w-full rounded-xl object-cover" style={{ border: '1px solid var(--border-glass)', aspectRatio: '16/9' }} />
                    ))}
                  </div>
                </section>
              )}

              {/* Key Features */}
              <section>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {software.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                      {f}
                    </div>
                  ))}
                </div>
              </section>

              {/* System Requirements */}
              <section>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>System Requirements</h2>
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(software.requirements).map(([key, val]) => (
                      <div key={key}>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                          {key === 'os' ? 'Operating System' : key === 'cpu' ? 'Processor' : key === 'gpu' ? 'Graphics' : key.toUpperCase()}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Installation Guide */}
              <section>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>How to Install {software.name}</h2>
                <ol className="space-y-3">
                  {software.installGuide.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: 'var(--accent-gradient)', color: 'white' }}>
                        {i + 1}
                      </span>
                      <p className="text-sm pt-1" style={{ color: 'var(--text-secondary)' }}>{step}</p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* FAQs */}
              {software.faqs?.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {software.faqs.map((faq, i) => (
                      <div key={i} className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                        <p className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Info Card */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Software Info
                </h3>
                {[
                  { label: 'Developer', value: software.developer },
                  { label: 'Version', value: software.version },
                  { label: 'License', value: software.license },
                  { label: 'File Size', value: software.size },
                  { label: 'Platform', value: software.platform.join(', ') },
                  { label: 'Last Updated', value: new Date(software.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
                <a href={software.downloadUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-primary mt-4 flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold">
                  <Download className="w-4 h-4" />
                  Free Download
                </a>
              </div>

              {/* Platform Tags */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                <h3 className="font-bold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {software.platform.map(p => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <Monitor className="w-3 h-3 inline mr-1" />{p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Software */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>Related Software</h3>
                  <div className="space-y-3">
                    {related.map(r => (
                      <Link key={r.id} to={`/software/${r.slug}`}
                        className="card group flex items-center gap-3 p-3">
                        <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-sm"
                          style={{ background: 'var(--accent-gradient)', color: 'white' }}>
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold group-hover:text-[var(--accent-primary)] transition-colors"
                            style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.subcategory}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                      </Link>
                    ))}
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

export default SoftwareDetailPage
