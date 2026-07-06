import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Files, 
  Download, 
  Link as LinkIcon, 
  Smartphone, 
  Bot, 
  PenTool, 
  Tags,
  Settings,
  LogOut,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth()

  const navItems = [
    { name: 'Dashboard', path: '/secure-admin-upload', icon: LayoutDashboard, exact: true },
    { name: 'STL Files', path: '/secure-admin-upload/stl-files', icon: Files },
    { name: 'Premium Downloads', path: '/secure-admin-upload/premium-downloads', icon: Download },
    { name: 'Website Links', path: '/secure-admin-upload/website-links', icon: LinkIcon },
    { name: 'APK Items', path: '/secure-admin-upload/apks', icon: Smartphone },
    { name: 'AI Tools', path: '/secure-admin-upload/ai-tools', icon: Bot },
    { name: 'Blogs', path: '/secure-admin-upload/blogs', icon: PenTool },
    { name: 'Categories', path: '/secure-admin-upload/categories', icon: Tags },
    { name: 'Settings', path: '/secure-admin-upload/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 glass-strong border-r border-[var(--border-glass)]
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-glass)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold">
              ST
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <button onClick={onClose} className="p-2 lg:hidden rounded-lg hover:bg-[var(--bg-secondary)]">
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => { if(window.innerWidth < 1024) onClose() }}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-glass)]">
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-muted)] truncate px-2">
              {user?.email}
            </div>
            <button
              onClick={signOut}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
