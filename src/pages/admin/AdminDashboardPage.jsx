import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Files, Download, Link as LinkIcon, Smartphone, Bot, PenTool, Activity } from 'lucide-react'
import { supabase } from '../../config/supabase'
import { aiToolsList } from '../../data/aiToolsData'
import { blogPosts as allPosts } from '../../data/blogPosts'

const StatCard = ({ title, value, icon: Icon, color, link }) => (
  <Link to={link} className="card p-6 flex items-center gap-4 group">
    <div className={`p-4 rounded-xl transition-transform group-hover:scale-110 ${color.bg}`}>
      <Icon className={`w-6 h-6 ${color.text}`} />
    </div>
    <div>
      <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  </Link>
)

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    files: 0,
    premium: 0,
    links: 0,
    apks: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const getCount = async (table) => {
          const { count } = await supabase.from(table).select('id', { count: 'exact', head: true })
          return count || 0
        }

        const [files, premium, links, apks] = await Promise.all([
          getCount('files'),
          getCount('premium_downloads').catch(() => 0), // Graceful fallback if table missing
          getCount('website_links').catch(() => 0),
          getCount('apk_items').catch(() => 0)
        ])

        setStats({ files, premium, links, apks })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }
    fetchStats()
  }, [])

  const statItems = [
    { title: 'STL Files', value: stats.files, icon: Files, link: '/secure-admin-upload/stl-files', color: { bg: 'bg-orange-500/10', text: 'text-orange-400' } },
    { title: 'Free Resources', value: stats.premium, icon: Download, link: '/secure-admin-upload/premium-downloads', color: { bg: 'bg-blue-500/10', text: 'text-blue-400' } },
    { title: 'Web Directory', value: stats.links, icon: LinkIcon, link: '/secure-admin-upload/website-links', color: { bg: 'bg-green-500/10', text: 'text-green-400' } },
    { title: 'Android Apps', value: stats.apks, icon: Smartphone, link: '/secure-admin-upload/apks', color: { bg: 'bg-purple-500/10', text: 'text-purple-400' } },
    { title: 'AI Tools', value: aiToolsList.length, icon: Bot, link: '/secure-admin-upload/ai-tools', color: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' } },
    { title: 'Blog Posts', value: allPosts.length, icon: PenTool, link: '/secure-admin-upload/blogs', color: { bg: 'bg-pink-500/10', text: 'text-pink-400' } },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Dashboard Overview</h1>
        <p className="text-[var(--text-secondary)] text-sm">Welcome back. Here is a summary of your website content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="card p-6 border-l-4 border-l-[var(--accent-primary)]">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg text-[var(--accent-primary)] mt-1">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">System Status: Healthy</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
              STL Files, Free Resources, Web Directory, and Android Apps can be managed directly through this dashboard.
              <br/><br/>
              Note: AI Tools and Blog Posts are managed via static code deployments. You can view them here, but adding or editing requires pushing code changes to GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
