import { motion } from 'framer-motion'
import { Copyright } from 'lucide-react'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
)

const DmcaPage = () => (
  <>
    <SEOHead
      title="DMCA Policy — STL Mirror"
      description="STL Mirror's DMCA Policy explains how to file a copyright takedown request and how we handle intellectual property complaints."
      canonical="/dmca"
    />

    <div className="min-h-screen bg-grid">
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5">
            <Copyright className="w-4 h-4" style={{ color: '#f87171' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Legal</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="gradient-text">DMCA Policy</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last Updated: June 1, 2025
          </motion.p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'DMCA Policy' }]} />
        </div>

        <div className="p-6 sm:p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
          <Section title="Overview">
            <p>STL Mirror respects the intellectual property rights of others and expects users and content creators to do the same. In accordance with the Digital Millennium Copyright Act (DMCA) of 1998, we will respond expeditiously to claims of copyright infringement that are reported to our designated copyright agent.</p>
          </Section>

          <Section title="What We Host">
            <p>STL Mirror is a content and information platform. We publish original reviews, guides, tutorials, and articles. We do not host, distribute, or provide direct downloads of third-party software files — all download links direct users to official developer websites.</p>
            <p>If you believe any content we have published (articles, images, screenshots, or text) infringes your copyright, please follow the procedure below.</p>
          </Section>

          <Section title="Filing a DMCA Takedown Notice">
            <p>To file a notice of infringement, please send a written communication to our designated DMCA agent at <strong style={{ color: 'var(--text-primary)' }}>dmca@stlmirror.in</strong> with the following information:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright that has been allegedly infringed</li>
              <li>Identification of the copyrighted work you claim has been infringed, or if multiple works are covered by a single notification, a representative list of such works</li>
              <li>Identification of the material that you claim is infringing, with information reasonably sufficient to permit us to locate the material on our website (e.g., URL of the specific page)</li>
              <li>Your name, address, telephone number, and email address</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
              <li>A statement that the information in the notification is accurate, and, under penalty of perjury, that you are authorised to act on behalf of the owner of an exclusive right that is allegedly infringed</li>
            </ol>
          </Section>

          <Section title="Our Response">
            <p>Upon receipt of a valid DMCA notice, we will:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acknowledge receipt of your complaint within 2 business days</li>
              <li>Remove or disable access to the allegedly infringing content within 5 business days (or sooner for urgent cases)</li>
              <li>Notify the user who posted the content that it has been removed</li>
              <li>Retain copies of all notices as required by law</li>
            </ul>
          </Section>

          <Section title="Counter-Notice Procedure">
            <p>If you believe your content was removed in error, you may submit a counter-notice. The counter-notice must include:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Your physical or electronic signature</li>
              <li>Identification of the removed material and its former location</li>
              <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification</li>
              <li>Your name, address, telephone number, and a statement that you consent to the jurisdiction of the Federal District Court for your judicial district</li>
            </ol>
          </Section>

          <Section title="Repeat Infringers">
            <p>STL Mirror will terminate, in appropriate circumstances, the accounts or access of users who are determined to be repeat infringers of the copyrights of others.</p>
          </Section>

          <Section title="False Claims">
            <p>Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material is infringing may be liable for damages, including costs and attorneys' fees. If you are unsure whether the material infringes your copyright, consult an attorney before submitting a claim.</p>
          </Section>

          <Section title="DMCA Contact">
            <p>Send all DMCA notices and related correspondence to:</p>
            <div className="mt-3 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>DMCA Agent:</strong> STL Mirror Legal Team</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> <a href="mailto:dmca@stlmirror.in" className="underline" style={{ color: 'var(--accent-primary)' }}>dmca@stlmirror.in</a></p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Response Time:</strong> 2–5 business days</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  </>
)

export default DmcaPage
