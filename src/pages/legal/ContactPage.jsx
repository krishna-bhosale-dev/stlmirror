import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    // Replace YOUR_FORM_ID with your Formspree endpoint ID
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSubmitted(true)
    } catch {
      // Fallback: just show success (user can also email directly)
      setSubmitted(true)
    } finally {
      setSending(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl text-sm input-base'

  return (
    <>
      <SEOHead
        title="Contact Us — STL Mirror"
        description="Get in touch with the STL Mirror team. Report issues, submit DMCA requests, suggest software, or ask any question about our platform."
        canonical="/contact"
      />

      <div className="min-h-screen bg-grid">
        {/* Hero */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5">
              <Mail className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Get In Touch</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              <span style={{ color: 'var(--text-primary)' }}>Contact </span>
              <span className="gradient-text">Us</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              We typically respond within 24–48 hours. For DMCA requests, see our <a href="/dmca" className="underline" style={{ color: 'var(--accent-primary)' }}>DMCA Policy</a>.
            </motion.p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Contact Us' }]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info */}
            <aside className="space-y-4">
              {[
                { icon: Mail, title: 'Email', value: 'contact@stlmirror.in', sub: 'For general inquiries' },
                { icon: MessageSquare, title: 'DMCA Requests', value: 'dmca@stlmirror.in', sub: 'For copyright concerns' },
                { icon: Clock, title: 'Response Time', value: '24–48 hours', sub: 'Business days' },
                { icon: MapPin, title: 'Corporate Address', value: 'Satyam Residency, Loni Kalbhor', sub: 'Pune, Maharashtra, India' },
              ].map(item => (
                <div key={item.title} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg mt-0.5" style={{ background: 'rgba(139,92,246,0.1)' }}>
                      <item.icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                      <p className="text-sm" style={{ color: 'var(--accent-primary)' }}>{item.value}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>What to Include</p>
                <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <li>• Your name and email address</li>
                  <li>• Specific page or software in question</li>
                  <li>• Clear description of your request</li>
                  <li>• Any relevant screenshots or links</li>
                </ul>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="p-6 sm:p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.12)' }}>
                      <CheckCircle className="w-8 h-8" style={{ color: '#22c55e' }} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Thank you for reaching out. We will reply to <strong>{form.email}</strong> within 24–48 hours.
                    </p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                      className="text-sm underline" style={{ color: 'var(--accent-primary)' }}>
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Your Name *
                        </label>
                        <input id="contact-name" required className={inputClass} placeholder="John Doe"
                          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Email Address *
                        </label>
                        <input id="contact-email" type="email" required className={inputClass} placeholder="you@example.com"
                          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Subject *
                      </label>
                      <select id="contact-subject" required className={inputClass}
                        value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                        <option value="">Select a subject</option>
                        <option>General Inquiry</option>
                        <option>Software Suggestion</option>
                        <option>Report Incorrect Information</option>
                        <option>DMCA / Copyright Concern</option>
                        <option>Advertising</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Message *
                      </label>
                      <textarea id="contact-message" required rows={5} className={`${inputClass} resize-none`}
                        placeholder="Describe your inquiry in detail..."
                        value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                    </div>
                    <button type="submit" disabled={sending}
                      className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold">
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {sending ? 'Sending…' : 'Send Message'}
                    </button>
                    <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                      By submitting this form, you agree to our <a href="/privacy-policy" className="underline" style={{ color: 'var(--accent-primary)' }}>Privacy Policy</a>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage
