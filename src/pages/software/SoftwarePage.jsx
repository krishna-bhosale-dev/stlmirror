import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Star, Cpu, Smartphone, FileText, Code, ChevronRight, TrendingUp, Clock, RefreshCw } from 'lucide-react'
import { getFeaturedSoftware, softwareList } from '../../data/softwareData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import Badge from '../../components/common/Badge'
import PageHero from '../../components/common/PageHero'

const categoryCards = [
  { title: 'Android APKs', description: 'Emulators, launchers, and must-have Android apps', href: '/apk', icon: Smartphone, count: softwareList.filter(s => s.category === 'APK').length, color: '#3ddc84', bg: 'rgba(61,220,132,0.1)' },
  { title: 'PDF Tools', description: 'Readers, editors, and converters for PDF files', href: '/pdf-tools', icon: FileText, count: softwareList.filter(s => s.category === 'PDF Tools').length, color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
  { title: 'Developer Tools', description: 'IDEs, version control, and productivity tools for devs', href: '/developer-tools', icon: Code, count: softwareList.filter(s => s.category === 'Developer Tools').length, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
]

const quickLinks = [
  { title: 'Latest Software', href: '/latest', icon: Clock, desc: 'Recently added to our directory' },
  { title: 'Most Downloaded', href: '/most-downloaded', icon: TrendingUp, desc: 'Most popular by download count' },
  { title: 'Recently Updated', href: '/recently-updated', icon: RefreshCw, desc: 'Fresh versions and updates' },
]

const SoftwareCard = ({ software }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    className="card group p-5">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl font-black"
        style={{ background: 'var(--accent-gradient)', color: 'white' }}>
        {software.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{software.name}</h3>
          <Badge category={software.category} size="xs">{software.category}</Badge>
        </div>
        <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{software.description}</p>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" style={{ color: '#fbbf24' }} />
            {software.rating}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {software.downloads}
          </span>
          <span>{software.version}</span>
        </div>
      </div>
    </div>
    <Link to={`/software/${software.slug}`}
      className="mt-4 btn-primary flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold">
      View Details <ChevronRight className="w-3.5 h-3.5" />
    </Link>
  </motion.div>
)

const SoftwarePage = () => {
  const featured = getFeaturedSoftware()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Software Directory — STL Mirror',
    url: 'https://www.stlmirror.in/software',
    description: 'Browse our curated software directory with in-depth reviews, download guides, and installation tutorials.',
  }

  return (
    <>
      <SEOHead
        title="Software Directory — Apps, Tools & Downloads"
        description="Browse our curated software directory with in-depth reviews, system requirements, and installation guides for Android emulators, PDF tools, developer utilities, and more."
        canonical="/software"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-grid">
        <PageHero
          icon={Cpu}
          badge="Software Directory"
          title="Discover & Download"
          titleGradient="The Best Software"
          description={`${softwareList.length}+ software titles with in-depth reviews, download guides, and installation tutorials — curated by our expert team.`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Software' }]} />
          </div>

          {/* Category Cards */}
          <section className="mb-14">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <h2 className="text-xl font-bold min-w-0" style={{ color: 'var(--text-primary)' }}>Browse by Category</h2>
              <div className="flex-1 h-px hidden sm:block" style={{ background: 'var(--border-glass)' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {categoryCards.map(cat => (
                <Link key={cat.href} to={cat.href} className="card group p-6 text-center hover:no-underline">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                    style={{ background: cat.bg }}>
                    <cat.icon className="w-7 h-7" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{cat.title}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: cat.color }}>
                    {cat.count} tools listed
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section className="mb-14">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <h2 className="text-xl font-bold min-w-0" style={{ color: 'var(--text-primary)' }}>Quick Access</h2>
              <div className="flex-1 h-px hidden sm:block" style={{ background: 'var(--border-glass)' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className="card group p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <link.icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-[var(--accent-primary)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}>{link.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{link.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto" style={{ color: 'var(--text-muted)' }} />
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Software */}
          <section>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <Star className="w-5 h-5 flex-shrink-0" style={{ color: '#fbbf24' }} />
              <h2 className="text-xl font-bold min-w-0" style={{ color: 'var(--text-primary)' }}>Featured Software</h2>
              <div className="flex-1 h-px hidden sm:block" style={{ background: 'var(--border-glass)' }} />
              <Link to="/software" className="text-sm font-medium flex items-center gap-1 whitespace-nowrap"
                style={{ color: 'var(--accent-primary)' }}>
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(s => <SoftwareCard key={s.id} software={s} />)}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default SoftwarePage
