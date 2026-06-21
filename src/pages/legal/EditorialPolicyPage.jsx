import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, Users, RefreshCw, Star } from 'lucide-react'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'

const Section = ({ icon: Icon, title, children, color = 'var(--accent-primary)' }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    </div>
    <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
)

const EditorialPolicyPage = () => (
  <>
    <SEOHead
      title="Editorial Policy — STL Mirror"
      description="Learn about STL Mirror's editorial standards, research methodology, update policy, and commitment to providing accurate, independent software reviews and guides."
      canonical="/editorial-policy"
    />

    <div className="min-h-screen bg-grid">
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5">
            <BookOpen className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>E-E-A-T</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span style={{ color: 'var(--text-primary)' }}>Editorial </span>
            <span className="gradient-text">Policy</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Our commitment to accuracy, independence, and quality in every article and review.
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Editorial Policy' }]} />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Articles Published', value: '90+', icon: BookOpen },
            { label: 'Author', value: '1', icon: Users },
            { label: 'Fact-Checked', value: '100%', icon: Star },
            { label: 'Update Frequency', value: 'Monthly', icon: RefreshCw },
          ].map(item => (
            <div key={item.label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
              <item.icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
            </div>
          ))}
        </div>

        <Section icon={CheckCircle} title="Our Editorial Standards" color="#22c55e">
          <p>Every piece of content published on STL Mirror must meet the following standards before publication:</p>
          <ul className="space-y-2">
            {[
              'Factual accuracy: All claims are verified against primary sources (official developer documentation, independent test labs, or direct testing)',
              'Original research: Articles are not copied from other websites; all content is original and written by our editorial team',
              'No pay-to-play: We do not accept payment for positive coverage or for including products in our guides',
              'Source transparency: External sources cited in articles are linked so readers can verify information independently',
              'Clear disclosure: Affiliate relationships, sponsored content, and free products received for review are clearly disclosed',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={BookOpen} title="Research Methodology">
          <p>STL Mirror is run by one person — Krishna Bhosale — a software engineering student at VIT Pune. When writing software reviews and guides, I follow a consistent process:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong style={{ color: 'var(--text-primary)' }}>Direct testing:</strong> I download and personally use every tool I review in real-world scenarios before writing a single word</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Performance evaluation:</strong> I measure launch times, memory usage, and feature completeness against competing products where relevant</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Community research:</strong> I review genuine user feedback from Reddit, app stores, and developer forums to validate my findings</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Documentation review:</strong> I consult official developer documentation to ensure technical accuracy</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Self-review:</strong> All articles are reviewed at least 24 hours after initial writing to catch errors and improve clarity</li>
          </ol>
        </Section>

        <Section icon={RefreshCw} title="Update & Correction Policy">
          <p>Software evolves rapidly. We are committed to keeping our content accurate:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Major software articles are reviewed quarterly or when significant version changes occur</li>
            <li>We prominently display the "Last Updated" date on all articles</li>
            <li>If you spot an error, please use our <a href="/contact" className="underline" style={{ color: 'var(--accent-primary)' }}>Contact page</a> to report it — we take corrections seriously</li>
            <li>Corrections are applied within 48 hours of verification</li>
            <li>Significant corrections are noted at the bottom of the affected article</li>
          </ul>
        </Section>

        <Section icon={Users} title="About the Author">
          <p>All content on STL Mirror is written by <strong>Krishna Bhosale</strong>, founder and sole author. Krishna is a software engineering student at Vishwakarma Institute of Technology (VIT), Pune, specialising in full-stack development, AI integration, and cybersecurity.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personally tests every tool before writing about it — no second-hand summaries</li>
            <li>Has hands-on development experience in React, Node.js, Android, and AI tooling</li>
            <li>Reviews software through the lens of students and developers on modest budgets</li>
            <li>Discloses affiliate relationships explicitly on relevant pages</li>
            <li>Follows journalistic ethics standards for accuracy, fairness, and independence</li>
          </ul>
          <p>You can read more about Krishna's methodology and background on the <a href="/author/krishna-bhosale" className="underline" style={{ color: 'var(--accent-primary)' }}>Author page</a>.</p>
        </Section>

        <Section icon={Star} title="Independence Statement">
          <p>STL Mirror maintains complete editorial independence. Our rankings, recommendations, and reviews reflect the genuine assessment of our testing and research — not the size of a company's marketing budget or any commercial relationships.</p>
          <p>If commercial relationships (affiliate partnerships, advertising) exist that could be perceived as influencing our coverage, we disclose them explicitly in the relevant content.</p>
          <p>We believe that independent, honest software recommendations serve both our readers and the wider software community far better than any short-term commercial gain from biased coverage.</p>
        </Section>
      </div>
    </div>
  </>
)

export default EditorialPolicyPage
