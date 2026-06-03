import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>{children}</div>
  </div>
)

const PrivacyPolicyPage = () => (
  <>
    <SEOHead
      title="Privacy Policy — STL Mirror"
      description="Read the STL Mirror Privacy Policy to understand how we collect, use, and protect your personal information when you visit our platform."
      canonical="/privacy-policy"
      noindex={false}
    />

    <div className="min-h-screen bg-grid">
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5">
            <Shield className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Legal</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="gradient-text">Privacy Policy</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last Updated: June 1, 2025
          </motion.p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
        </div>

        <div className="p-6 sm:p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
          <Section title="1. Introduction">
            <p>Welcome to STL Mirror ("we," "our," or "us"). We operate the website at https://www.stlmirror.in (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
            <p>Please read this policy carefully. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p><strong style={{ color: 'var(--text-primary)' }}>Information you provide directly:</strong> When you use our contact form, we collect your name, email address, and the content of your message. We do not store this information ourselves — it is transmitted via our form provider (Formspree).</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Automatically collected information:</strong> When you visit the Service, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and cookies installed on your device.</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Analytics data:</strong> We use Vercel Analytics to collect aggregated, anonymous data about page views, traffic sources, and general usage patterns. This data does not personally identify you.</p>
          </Section>

          <Section title="3. Use of Cookies">
            <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'var(--text-primary)' }}>Essential cookies:</strong> Necessary for the Service to function. Cannot be disabled.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Analytics cookies:</strong> Help us understand how visitors use the site.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Advertising cookies (Google AdSense):</strong> If we display ads, Google AdSense may use cookies to serve personalised advertisements based on your visits to our site and other sites on the internet. You may opt out via <a href="https://www.google.com/settings/ads" className="underline" style={{ color: 'var(--accent-primary)' }} target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</li>
            </ul>
          </Section>

          <Section title="4. Google AdSense & Third-Party Advertising">
            <p>STL Mirror may use Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies (including the DoubleClick cookie) to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</p>
            <p>Users may opt out of personalised advertising by visiting Google's <a href="https://www.google.com/settings/ads" className="underline" style={{ color: 'var(--accent-primary)' }} target="_blank" rel="noopener noreferrer">Ads Settings</a> or by visiting <a href="https://www.aboutads.info" className="underline" style={{ color: 'var(--accent-primary)' }} target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>
          </Section>

          <Section title="5. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide, operate, and maintain our website</li>
              <li>Respond to your contact form submissions</li>
              <li>Monitor and analyse usage to improve user experience</li>
              <li>Detect and prevent technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="6. Data Sharing & Disclosure">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'var(--text-primary)' }}>Service providers:</strong> We use Vercel (hosting), Supabase (database), Cloudflare (CDN), and Formspree (contact forms) to operate the Service.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Legal requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <p>We retain contact form submissions for 30 days via our form provider. Analytics data is retained in aggregated, anonymous form for up to 12 months.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>Our Service is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at contact@stlmirror.in.</p>
          </Section>

          <Section title="9. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate data</li>
              <li>The right to erasure ("right to be forgotten")</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
            <p>To exercise any of these rights, please contact us at contact@stlmirror.in.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated "Last Updated" date. Changes are effective immediately upon posting.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email: contact@stlmirror.in</li>
              <li>Website: <a href="/contact" className="underline" style={{ color: 'var(--accent-primary)' }}>https://www.stlmirror.in/contact</a></li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  </>
)

export default PrivacyPolicyPage
