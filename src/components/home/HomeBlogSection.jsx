import { Link } from 'react-router-dom'
import { PenTool, Clock, Calendar } from 'lucide-react'
import HomeSectionHeader from './HomeSectionHeader'
import { blogPosts as allPosts } from '../../data/blogPosts'

const HomeBlogSection = () => {
  // Sort by date, get latest 3
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  if (latestPosts.length === 0) return null

  return (
    <section className="mb-16">
      <HomeSectionHeader 
        icon={PenTool} 
        title="Latest Blog Posts" 
        linkTo="/blog" 
        colorClass="text-green-400"
        bgClass="bg-green-500/10 border-green-500/20"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {latestPosts.map((post) => (
          <article key={post.slug} className="card group overflow-hidden flex flex-col h-full relative">
            <Link to={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
            
            <div className="w-full h-40 overflow-hidden bg-[var(--bg-secondary)] relative">
              {post.coverImage ? (
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] group-hover:scale-105 transition-transform duration-500">
                  <PenTool className="w-10 h-10 text-[var(--border-glass)]" />
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col flex-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--accent-primary)] mb-2">
                {post.category}
              </span>
              <h3 className="font-bold text-[var(--text-primary)] mb-2 leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              
              <div className="mt-auto flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomeBlogSection
