/**
 * Badge — category/tag chip
 * variant: 'primary' | 'secondary' | 'outline' | 'android' | 'dev' | 'pdf' | 'productivity' | 'tools' | 'security'
 */
const variantStyles = {
  primary:      { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' },
  secondary:    { background: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.3)' },
  outline:      { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' },
  android:      { background: 'rgba(61,220,132,0.12)', color: '#3ddc84', border: '1px solid rgba(61,220,132,0.3)' },
  dev:          { background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' },
  pdf:          { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' },
  productivity: { background: 'rgba(250,204,21,0.12)', color: '#fbbf24', border: '1px solid rgba(250,204,21,0.3)' },
  tools:        { background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' },
  security:     { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' },
}

const categoryVariantMap = {
  'Android':      'android',
  'Development':  'dev',
  'PDF Tools':    'pdf',
  'Productivity': 'productivity',
  'Tools':        'tools',
  'Security':     'security',
  'Tutorials':    'secondary',
}

const Badge = ({ children, variant, category, className = '', size = 'sm' }) => {
  const resolvedVariant = variant || (category && categoryVariantMap[category]) || 'primary'
  const style = variantStyles[resolvedVariant] || variantStyles.primary
  const sizeClass = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeClass} ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}

export default Badge
