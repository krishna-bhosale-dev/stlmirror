import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Files, Zap, ArrowDown, Download, LinkIcon, Smartphone } from 'lucide-react'
import { supabase } from '../config/supabase'
import SearchBar from '../components/search/SearchBar'
import Banner728 from '../components/ads/Banner728'

// Sections
import HomeStlFilesSection from '../components/home/HomeStlFilesSection'
import HomeAiToolsSection from '../components/home/HomeAiToolsSection'
import HomeBlogSection from '../components/home/HomeBlogSection'
import HomePlaceholderSection from '../components/home/HomePlaceholderSection'

const StatBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
    <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
    <span className="text-sm text-[var(--text-secondary)]">{label}</span>
    <span className="text-sm font-bold text-[var(--text-primary)]">{value}</span>
  </div>
)

const HomePage = ({ externalSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statsCount, setStatsCount] = useState({ total: 0 })

  // Data states
  const [stlFiles, setStlFiles] = useState([])
  const [stlLoading, setStlLoading] = useState(true)
  const [premiumDownloads, setPremiumDownloads] = useState([])
  const [websiteLinks, setWebsiteLinks] = useState([])
  const [apks, setApks] = useState([])

  // Sync navbar search
  useEffect(() => {
    if (externalSearch !== undefined) {
      setSearchQuery(externalSearch)
    }
  }, [externalSearch])

  // Fetch Homepage Data
  useEffect(() => {
    const fetchData = async () => {
      // Total files for stats
      supabase.from('files').select('id', { count: 'exact', head: true }).then(({ count }) => {
        setStatsCount({ total: count || 0 })
      })

      // Fetch Latest 4 STL Files
      setStlLoading(true)
      supabase.from('files').select('*').order('created_at', { ascending: false }).limit(4).then(({ data }) => {
        if (data) setStlFiles(data)
        setStlLoading(false)
      })

      // Fetch Premium Downloads
      supabase.from('premium_downloads').select('*').order('created_at', { ascending: false }).limit(4).then(({ data }) => {
        if (data) setPremiumDownloads(data)
      }).catch(() => {}) // Graceful fallback if table doesn't exist

      // Fetch Website Links
      supabase.from('website_links').select('*').order('created_at', { ascending: false }).limit(4).then(({ data }) => {
        if (data) setWebsiteLinks(data)
      }).catch(() => {})

      // Fetch APKs
      supabase.from('apk_items').select('*').order('created_at', { ascending: false }).limit(4).then(({ data }) => {
        if (data) setApks(data)
      }).catch(() => {})
    }

    fetchData()
  }, [])


  return (
    <div className="min-h-screen bg-grid">
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
          >
            <span className="text-[var(--text-primary)]">Your Premium</span>
            <br />
            <span className="gradient-text">Digital Resource Hub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Browse, search, preview, and download premium assets.
            STL Files, Tools, APKs, and Links — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search across all resources..."
              className="w-full text-base"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <StatBadge icon={Files} label="Total Files" value={statsCount.total} />
            <StatBadge icon={Zap} label="Instant" value="Downloads" />
          </motion.div>

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

      <Banner728 />

      {/* ─── Content Sections ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* STL Files */}
        <HomeStlFilesSection files={stlFiles} loading={stlLoading} />

        {/* AI Tools */}
        <HomeAiToolsSection />

        {/* Blogs */}
        <HomeBlogSection />

        {/* Free Resources */}
        <HomePlaceholderSection 
          items={premiumDownloads}
          title="Free Resources"
          icon={Download}
          linkTo="/premium-downloads"
          colorClass="text-blue-400"
          bgClass="bg-blue-500/10 border-blue-500/20"
          renderItem={(item) => (
            <a key={item.id} href={item.file_url} target="_blank" rel="noopener noreferrer" className="card group overflow-hidden flex flex-col h-full hover:border-[var(--accent-primary)] transition-colors">
              <div className="w-full h-32 relative overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <Download className="w-10 h-10 text-[var(--border-glass)] group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs text-[var(--text-muted)] mb-1">{item.category}</span>
                <h3 className="font-bold text-sm mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{item.title}</h3>
                <div className="mt-auto pt-3 border-t border-[var(--border-glass)] text-xs text-[var(--text-muted)] flex justify-between">
                  <span>{item.downloads || 0} Downloads</span>
                </div>
              </div>
            </a>
          )}
        />

        {/* Web Directory */}
        <HomePlaceholderSection 
          items={websiteLinks}
          title="Web Directory"
          icon={LinkIcon}
          linkTo="/website-links"
          colorClass="text-green-400"
          bgClass="bg-green-500/10 border-green-500/20"
          renderItem={(item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="card group overflow-hidden flex flex-col h-full hover:border-[var(--accent-primary)] transition-colors">
              <div className="w-full h-32 relative overflow-hidden bg-white flex items-center justify-center p-4">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <LinkIcon className="w-10 h-10 text-[var(--border-glass)] group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs text-[var(--text-muted)] mb-1">{item.category}</span>
                <h3 className="font-bold text-sm mb-2 group-hover:text-green-400 transition-colors line-clamp-2">{item.title}</h3>
              </div>
            </a>
          )}
        />

        {/* Android Apps */}
        <HomePlaceholderSection 
          items={apks}
          title="Android Apps"
          icon={Smartphone}
          linkTo="/apks"
          colorClass="text-purple-400"
          bgClass="bg-purple-500/10 border-purple-500/20"
          renderItem={(item) => (
            <a key={item.id} href={item.file_url} target="_blank" rel="noopener noreferrer" className="card group overflow-hidden flex flex-col h-full hover:border-[var(--accent-primary)] transition-colors">
              <div className="w-full h-32 relative overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center p-4">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="w-16 h-16 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <Smartphone className="w-10 h-10 text-[var(--border-glass)] group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-[var(--text-muted)]">{item.category}</span>
                  <span className="text-xs font-mono text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-1.5 py-0.5 rounded">v{item.version}</span>
                </div>
                <h3 className="font-bold text-sm mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">{item.title}</h3>
              </div>
            </a>
          )}
        />
        
      </div>
    </div>
  )
}

export default HomePage
