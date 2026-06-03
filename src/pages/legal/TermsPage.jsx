import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
)

const TermsPage = () => (
  <>
    <SEOHead
      title="Terms and Conditions — STL Mirror"
      description="Read the STL Mirror Terms and Conditions governing your use of our software resource platform, including usage rules, intellectual property, and limitation of liability."
      canonical="/terms"
    />

    <div className="min-h-screen bg-grid">
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5">
            <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Legal</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="gradient-text">Terms and Conditions</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last Updated: June 1, 2025
          </motion.p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Terms and Conditions' }]} />
        </div>

        <div className="p-6 sm:p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
          <Section title="1. Agreement to Terms">
            <p>By accessing and using the STL Mirror website at https://www.stlmirror.in ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of these Terms, you may not access the Service.</p>
          </Section>

          <Section title="2. Use of the Service">
            <p>STL Mirror provides a software resource platform including software reviews, guides, APK information, and developer tools content. You agree to use the Service only for lawful purposes and in accordance with these Terms.</p>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Use automated means to scrape, crawl, or download content without permission</li>
              <li>Reproduce, duplicate, copy, or resell any part of the Service in violation of these Terms</li>
              <li>Transmit any unsolicited or unauthorised advertising or promotional material</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation</li>
            </ul>
          </Section>

          <Section title="3. Intellectual Property">
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of STL Mirror and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
            <p>Articles, guides, and reviews published on STL Mirror are original works protected by copyright. You may quote short excerpts (up to 100 words) with clear attribution and a link back to the original article. Republishing full articles without written permission is prohibited.</p>
          </Section>

          <Section title="4. Third-Party Software and Downloads">
            <p>STL Mirror provides information about third-party software products. We do not develop, own, or distribute the software we review. All software download links direct to the official developer websites or authorised distributors.</p>
            <p>Your use of any third-party software is subject to that software's own terms and license agreements. STL Mirror is not responsible for the performance, security, or legality of any third-party software.</p>
          </Section>

          <Section title="5. Disclaimer of Warranties">
            <p>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
            <p>STL Mirror does not warrant that: (a) the Service will function uninterrupted, secure, or available at any particular time; (b) any errors or defects will be corrected; (c) the Service is free of viruses or other harmful components.</p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>In no event shall STL Mirror, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, goodwill, service interruption, computer damage, or system failure.</p>
          </Section>

          <Section title="7. Links to Other Websites">
            <p>Our Service may contain links to third-party websites or services not owned or controlled by STL Mirror. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites. We strongly recommend reading the terms and privacy policies of any third-party sites you visit.</p>
          </Section>

          <Section title="8. User Conduct">
            <p>Users must not post or transmit any content through our contact form or any other part of the Service that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</p>
          </Section>

          <Section title="9. Changes to Terms">
            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes your acceptance of the new Terms.</p>
          </Section>

          <Section title="10. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
          </Section>

          <Section title="11. Contact">
            <p>For questions about these Terms, contact us at contact@stlmirror.in or visit our <a href="/contact" className="underline" style={{ color: 'var(--accent-primary)' }}>Contact page</a>.</p>
          </Section>
        </div>
      </div>
    </div>
  </>
)

export default TermsPage
