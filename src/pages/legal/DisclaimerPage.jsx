import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
)

const DisclaimerPage = () => (
  <>
    <SEOHead
      title="Disclaimer — STL Mirror"
      description="Read the STL Mirror Disclaimer regarding the accuracy of information, affiliate links, third-party software, and the limitation of our liability."
      canonical="/disclaimer"
    />

    <div className="min-h-screen bg-grid">
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5">
            <AlertTriangle className="w-4 h-4" style={{ color: '#fb923c' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Legal</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="gradient-text">Disclaimer</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last Updated: June 1, 2025
          </motion.p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Disclaimer' }]} />
        </div>

        <div className="p-6 sm:p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
          <Section title="1. General Disclaimer">
            <p>The information provided on STL Mirror (https://www.stlmirror.in) is for general informational and educational purposes only. While we make every effort to keep the information accurate, up-to-date, and complete, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information on the website.</p>
          </Section>

          <Section title="2. Software Information Accuracy">
            <p>Software features, pricing, compatibility, and availability change frequently. Information on STL Mirror reflects our best knowledge at the time of writing and may not reflect the most current state of any software product. Always verify information directly on the software developer's official website before making any decision.</p>
            <p>Version numbers, download links, and system requirements listed on this site are provided for reference only. The official developer's website is the authoritative source for all such information.</p>
          </Section>

          <Section title="3. No Endorsement">
            <p>Any mention of specific software, companies, products, or services on STL Mirror does not constitute an official endorsement or recommendation. We do not receive payment from software developers for including their products in our reviews unless explicitly disclosed.</p>
          </Section>

          <Section title="4. Affiliate Link Disclosure">
            <p>STL Mirror may include affiliate links to third-party products or services. This means that if you click on certain links and make a purchase, we may receive a small commission at no additional cost to you. This helps us maintain the website and continue providing free content.</p>
            <p>Our editorial opinions are not influenced by affiliate relationships. We only recommend products we believe provide genuine value to our readers.</p>
          </Section>

          <Section title="5. Third-Party Downloads">
            <p>STL Mirror provides links to third-party websites for software downloads. We do not host software files ourselves. We are not responsible for the content, safety, or legality of files downloaded from third-party websites. Always download software from official developer websites and scan files with antivirus software before installation.</p>
          </Section>

          <Section title="6. Technical Information">
            <p>Any technical instructions, guides, or tutorials provided on STL Mirror are offered in good faith but without guarantee of outcome. Technical procedures may have unintended consequences depending on your specific system configuration. We recommend backing up your data before following any technical guide and proceeding at your own risk.</p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>In no event shall STL Mirror be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from following the information and guides on this website.</p>
          </Section>

          <Section title="8. External Links">
            <p>STL Mirror contains links to external websites. These links are provided for your convenience to provide further information. They do not signify our endorsement of those websites. We have no control over and accept no responsibility for the content of linked websites.</p>
          </Section>

          <Section title="9. Contact">
            <p>If you find any information on this site that you believe to be inaccurate, outdated, or harmful, please contact us at contact@stlmirror.in so we can review and correct it promptly.</p>
          </Section>
        </div>
      </div>
    </div>
  </>
)

export default DisclaimerPage
