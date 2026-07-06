import { Link } from 'react-router-dom'
import { Bot, Clock, ChevronRight } from 'lucide-react'
import HomeSectionHeader from './HomeSectionHeader'
import { aiToolsList } from '../../data/aiToolsData'
import { getFallbackImage, handleImageError } from '../../utils/fallbackImages'
import Badge from '../common/Badge'

const HomeAiToolsSection = () => {
  // Sort by date, get latest 4
  const latestTools = [...aiToolsList]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  if (latestTools.length === 0) return null

  return (
    <section className="mb-16">
      <HomeSectionHeader 
        icon={Bot} 
        title="Latest AI Tools" 
        linkTo="/ai-tools" 
        colorClass="text-purple-400"
        bgClass="bg-purple-500/10 border-purple-500/20"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {latestTools.map((tool) => (
          <article key={tool.id} className="card group overflow-hidden flex flex-col h-full">
            <div className="w-full h-32 relative overflow-hidden bg-[var(--bg-card)]">
              <img
                src={tool.thumbnail || getFallbackImage(tool.category)}
                alt={tool.logoAlt || tool.title}
                loading="lazy"
                onError={(e) => handleImageError(e, tool.category)}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge category={tool.category}>{tool.category}</Badge>
              </div>
              
              <h3 className="font-bold text-sm mb-2 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2 leading-snug">
                <Link to={`/ai-tools/${tool.slug}`}>
                  <span className="absolute inset-0 z-10" />
                  {tool.title}
                </Link>
              </h3>
              
              <div className="mt-auto pt-3 border-t border-[var(--border-glass)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {tool.readTime}</span>
                <span className="group-hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1">Read <ChevronRight className="w-3 h-3"/></span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomeAiToolsSection
