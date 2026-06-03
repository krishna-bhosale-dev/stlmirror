import { Link } from 'react-router-dom'
import { PenLine, BookOpen, CheckCircle } from 'lucide-react'

/**
 * AuthorBox — E-E-A-T author section for blog posts
 */
const AuthorBox = ({
  name = 'STL Mirror Editorial Team',
  role = 'Software & Tech Writer',
  bio = 'Our editorial team consists of experienced software developers and tech enthusiasts who test every tool before writing about it. We\'re committed to providing accurate, up-to-date information to help you make the best software choices.',
  articleCount = 20,
  avatar = null,
}) => (
  <aside
    className="mt-12 p-6 rounded-2xl"
    style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-glass)',
    }}
  >
    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
      About the Author
    </p>
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-xl font-black"
        style={{ background: 'var(--accent-gradient)', color: 'white' }}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-xl object-cover" />
        ) : (
          name.charAt(0)
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{name}</h3>
        <p className="text-sm mb-2" style={{ color: 'var(--accent-primary)' }}>{role}</p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{bio}</p>

        {/* Credentials */}
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <PenLine className="w-3.5 h-3.5" />
            {articleCount} Articles
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <BookOpen className="w-3.5 h-3.5" />
            Expert Reviewed
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#22c55e' }}>
            <CheckCircle className="w-3.5 h-3.5" />
            Verified Author
          </span>
        </div>
      </div>
    </div>
  </aside>
)

export default AuthorBox
