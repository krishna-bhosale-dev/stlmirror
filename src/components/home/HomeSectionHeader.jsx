import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const HomeSectionHeader = ({ icon: Icon, title, linkTo, linkText = 'View All', colorClass = 'text-cyan-400', bgClass = 'bg-cyan-500/10 border-cyan-500/20' }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-xl border ${bgClass}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)]">
        {title}
      </h2>
      <div className="flex-1 h-px bg-[var(--border-glass)]" />
      {linkTo && (
        <Link 
          to={linkTo}
          className="flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors group whitespace-nowrap"
        >
          {linkText}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  )
}

export default HomeSectionHeader
