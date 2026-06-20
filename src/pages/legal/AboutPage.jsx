import { motion } from 'framer-motion'
import { Users, Target, CheckCircle, BookOpen, Heart, Shield } from 'lucide-react'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
        <Icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
      </div>
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    </div>
    <div style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
)

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About STL Mirror',
  url: 'https://www.stlmirror.in/about',
  description: 'Learn about STL Mirror — a software resource platform dedicated to helping users find, download, and learn about the best software tools.',
  publisher: { '@type': 'Organization', name: 'STL Mirror', url: 'https://www.stlmirror.in' },
}

const AboutPage = () => (
  <>
    <SEOHead
      title="About STL Mirror — Software Resource Platform"
      description="Learn about STL Mirror, our mission to provide trustworthy software guides, APK resources, developer tools, and expert technology content for millions of users."
      canonical="/about"
      structuredData={structuredData}
    />

    <div className="min-h-screen bg-grid">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5">
            <Users className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>About Us</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            <span style={{ color: 'var(--text-primary)' }}>About </span>
            <span className="gradient-text">STL Mirror</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Your trusted source for software reviews, APK downloads, developer tools, and expert tech guides — tested, verified, and updated regularly.
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'About Us' }]} />
        </div>

        {/* Mission */}
        <Section icon={Target} title="Our Mission">
          <p className="mb-4 leading-relaxed">
            STL Mirror was founded with a clear purpose: to make software discovery easy, safe, and informative. In an internet full of misleading download sites and outdated guides, we set out to create a platform where users can trust what they read and download.
          </p>
          <p className="leading-relaxed">
            Every article we publish is researched thoroughly. Every software we list is verified against the developer's official source. We believe that quality information, freely available, empowers users to make better decisions about the tools they use every day.
          </p>
        </Section>

        {/* What We Do */}
        <Section icon={BookOpen} title="What We Cover">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[
              { title: 'Software Reviews', desc: 'In-depth reviews of popular and emerging software tools across all categories.' },
              { title: 'APK Resources', desc: 'Curated Android APK information, installation guides, and safe download resources.' },
              { title: 'Developer Tools', desc: 'Guides and resources for developers: IDEs, version control, testing tools, and more.' },
              { title: 'PDF Tools', desc: 'Reviews and tutorials for PDF readers, editors, converters, and productivity tools.' },
              { title: 'Tech Tutorials', desc: 'Step-by-step guides that help both beginners and advanced users get the most from their software.' },
              { title: 'Productivity Apps', desc: 'Recommendations for apps that help you work smarter, stay organised, and focus better.' },
            ].map(item => (
              <div key={item.title} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Editorial Standards */}
        <Section icon={CheckCircle} title="Our Editorial Standards">
          <p className="mb-4 leading-relaxed">
            All content on STL Mirror is produced by our editorial team — experienced writers and developers who actually use the software they write about. We follow strict editorial guidelines:
          </p>
          <ul className="space-y-2">
            {[
              'We test every tool before writing about it',
              'We do not accept payment for positive reviews',
              'We clearly disclose any affiliate relationships',
              'We update articles whenever software versions change significantly',
              'We remove or update content that becomes inaccurate',
              'We cite primary sources (developer sites, official documentation)',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Author Team */}
        <Section icon={Heart} title="Meet the Founder">
          <p className="mb-6 leading-relaxed">
            STL Mirror was founded and is led by <strong style={{ color: 'var(--text-primary)' }}>Krishna Bhosale</strong>, a software engineering student at Vishwakarma Institute of Technology (VIT), Pune. Every review, guide, and tutorial published on STL Mirror is personally tested before being written — not summarised from vendor marketing materials.
          </p>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl"
                style={{ background: 'var(--accent-gradient)', color: 'white' }}>K</div>
              <div>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Krishna Bhosale</p>
                <p className="text-sm" style={{ color: 'var(--accent-primary)' }}>Founder & Lead Editor, STL Mirror</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Software Engineering Student · VIT Pune</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Krishna specialises in AI tools evaluation, software development (React, JavaScript, Android), and cybersecurity. He founded STL Mirror in 2023 with a focus on technically honest reviews for students and developers — particularly those in India who need reliable, budget-conscious software guidance.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['AI Tools', 'Software Development', 'Android & APK', 'Cybersecurity', 'Technical Writing'].map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <a href="/author/krishna-bhosale"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: 'var(--accent-primary)' }}>
              View Full Author Profile →
            </a>
          </div>
        </Section>


        {/* Trust */}
        <Section icon={Shield} title="Why Trust STL Mirror?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Verified Sources', desc: 'We link directly to official developer sites and never host software ourselves.' },
              { title: 'Regular Updates', desc: 'Content is reviewed and updated as software versions and features change.' },
              { title: 'No Hidden Agendas', desc: 'Our editorial team operates independently. Reviews reflect genuine testing outcomes.' },
            ].map(item => (
              <div key={item.title} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  </>
)

export default AboutPage
