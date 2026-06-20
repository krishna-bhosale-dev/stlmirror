import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Code2, Shield, Brain, ExternalLink, ChevronRight, Award, Calendar } from 'lucide-react'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Krishna Bhosale',
  jobTitle: 'Founder & Lead Editor',
  worksFor: { '@type': 'Organization', name: 'STL Mirror', url: 'https://www.stlmirror.in' },
  url: 'https://www.stlmirror.in/author/krishna-bhosale',
  knowsAbout: ['Software Reviews', 'AI Tools', 'Android Development', 'Cybersecurity', 'React Development'],
  description:
    'Krishna Bhosale is the founder and lead editor of STL Mirror, a software engineering student at VIT Pune with expertise in AI tools, software reviews, and web development.',
}

const expertise = [
  { icon: Brain, label: 'AI Tools & Research', desc: 'Hands-on evaluation of AI writing, coding, video, and productivity tools' },
  { icon: Code2, label: 'Software Development', desc: 'React, JavaScript, Node.js, Android, and developer tooling' },
  { icon: Shield, label: 'Cybersecurity', desc: 'Application security, safe software practices, and privacy-focused reviews' },
  { icon: BookOpen, label: 'Technical Writing', desc: 'Clear, actionable guides for students, developers, and professionals' },
]

const recentReviews = [
  { title: 'Perplexity AI Review: Is It Time to Ditch Google?', href: '/ai-tools/perplexity-ai-search-engine-review', date: 'June 2026' },
  { title: 'Windsurf Review: The Agentic IDE That Writes Code For You', href: '/ai-tools/windsurf-ai-code-editor-review', date: 'June 2026' },
  { title: 'Cursor AI Code Editor Review', href: '/ai-tools/cursor-ai-code-editor-review', date: 'June 2026' },
  { title: 'Claude AI Review: Is Anthropic\'s Model Better Than ChatGPT?', href: '/ai-tools/claude-anthropic-ai-review', date: 'June 2026' },
  { title: 'NotebookLM Review: Google\'s AI Research Tool', href: '/ai-tools/notebooklm-ai-research-tool-review', date: 'June 2026' },
  { title: 'Midjourney Review: The Undisputed King of AI Art', href: '/ai-tools/midjourney-ai-art-generator-review', date: 'June 2026' },
]

const AuthorPage = () => (
  <>
    <SEOHead
      title="Krishna Bhosale — Founder & Lead Editor, STL Mirror"
      description="Krishna Bhosale is the founder and lead editor of STL Mirror. Software engineering student at VIT Pune with expertise in AI tools, software reviews, Android development, and cybersecurity."
      canonical="/author/krishna-bhosale"
      structuredData={structuredData}
    />

    <div className="min-h-screen bg-grid">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl font-black shadow-2xl"
              style={{ background: 'var(--accent-gradient)', color: 'white' }}>
              K
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  Founder & Lead Editor
                </span>
                <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(6,182,212,0.12)', color: 'var(--accent-secondary)', border: '1px solid rgba(6,182,212,0.25)' }}>
                  Verified Author
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                Krishna Bhosale
              </h1>
              <p className="text-base mb-4" style={{ color: 'var(--accent-primary)' }}>
                Software Engineering Student • VIT Pune • Est. STL Mirror 2023
              </p>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                I founded STL Mirror to cut through the noise of software marketing and give students, developers, and everyday users honest, technically grounded reviews and guides. Every tool I review is something I have personally tested — not summarised from a press release.
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Reviewing software since 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" style={{ color: '#fbbf24' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>30+ AI tools reviewed</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" style={{ color: '#22c55e' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>85+ articles published</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Authors' }, { label: 'Krishna Bhosale' }]} />
        </div>

        {/* About the Author */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>About Krishna</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              I am a software engineering student at Vishwakarma Institute of Technology (VIT), Pune, specialising in full-stack development, AI integration, and cybersecurity. I built STL Mirror in 2023 because I was frustrated with software review sites that copied vendor marketing materials, used affiliate rankings based on commission rather than quality, and offered no genuine technical evaluation.
            </p>
            <p>
              My approach is different: I install the software, I use it for its intended purpose, I read the official documentation, and I test the edge cases that marketing materials never mention. When I review an AI tool like Cursor or Windsurf, I actually write real code in it. When I review a PDF reader like SumatraPDF or Foxit, I open the types of PDFs professionals actually deal with.
            </p>
            <p>
              My technical background informs every review. I understand what "hardware-accelerated decoding" means for a video player. I understand the security implications of a password manager's zero-knowledge architecture. I understand why "model context window" matters for an AI coding tool. This lets me explain features with the depth that technical users need, while remaining accessible to students and general users.
            </p>
            <p>
              I am particularly focused on the Indian student and developer audience — users who are budget-conscious, often on mid-range hardware, and increasingly building on AI-native tools. My reviews consistently address "free tier" value, performance on modest hardware, and practical use in academic and early-career professional contexts.
            </p>
          </div>
        </section>

        {/* Expertise Areas */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Areas of Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expertise.map(item => (
              <div key={item.label} className="p-5 rounded-xl flex gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                <div className="p-2.5 rounded-xl flex-shrink-0 h-fit" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
                  <item.icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Standards */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>My Editorial Standards</h2>
          <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
            <ul className="space-y-3">
              {[
                'Every tool is personally tested before I write a single word about it',
                'I disclose when I have used a trial, free tier, or paid account',
                'Affiliate relationships are disclosed prominently on relevant pages',
                'I update reviews when significant software versions change features I have described',
                'I link directly to official developer websites — never to unofficial mirrors',
                'Negative findings are reported honestly, even for tools STL Mirror receives affiliate revenue from',
                'I do not review tools I cannot access for hands-on evaluation',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--accent-primary)' }} />
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recent Reviews */}
        <section>
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Recent Reviews by Krishna</h2>
          <div className="space-y-3">
            {recentReviews.map(review => (
              <Link key={review.href} to={review.href}
                className="card group flex items-center justify-between gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold group-hover:text-[var(--accent-primary)] transition-colors truncate"
                    style={{ color: 'var(--text-primary)' }}>{review.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{review.date} · By Krishna Bhosale</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              </Link>
            ))}
          </div>
          <Link to="/ai-tools"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 mt-6 text-sm font-semibold">
            <ExternalLink className="w-4 h-4" />
            View All AI Tool Reviews
          </Link>
        </section>
      </div>
    </div>
  </>
)

export default AuthorPage
