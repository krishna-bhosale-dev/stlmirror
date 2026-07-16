import { Star } from 'lucide-react'

const PremiumFilesPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: 'var(--bg-primary)' }}>
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
      style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
      <Star className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
    </div>
    <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Premium Files</h1>
    <p className="text-base max-w-md" style={{ color: 'var(--text-secondary)' }}>
      Exclusive premium downloads for members — high-quality assets, templates, and more. Coming soon.
    </p>
  </div>
)

export default PremiumFilesPage
