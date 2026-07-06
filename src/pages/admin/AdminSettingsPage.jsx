import { Settings, Shield, Server } from 'lucide-react'
import { ADMIN_EMAILS } from '../../config/supabase'

const AdminSettingsPage = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">System Settings</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          View configuration and access control settings. To change these values, you must update the environment variables or configuration files.
        </p>
      </div>

      <div className="space-y-6">
        {/* Access Control */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-glass)]">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="font-bold text-[var(--text-primary)] text-lg">Access Control</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Authorized Admin Emails</p>
              <p className="text-xs text-[var(--text-muted)] mb-3">Only these emails can access the admin dashboard. Managed in <code className="text-xs text-[var(--accent-primary)]">src/config/supabase.js</code>.</p>
              
              <div className="space-y-2">
                {ADMIN_EMAILS.map(email => (
                  <div key={email} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-glass)] rounded-lg w-fit">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-sm text-[var(--text-secondary)] font-mono">{email}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-glass)]">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Server className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="font-bold text-[var(--text-primary)] text-lg">Integrations</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] border border-[var(--border-glass)] rounded-xl">
              <div>
                <p className="font-bold text-[var(--text-primary)] mb-1">Supabase Database</p>
                <p className="text-xs text-[var(--text-muted)]">PostgreSQL storage for all CRUD modules.</p>
              </div>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">Connected</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] border border-[var(--border-glass)] rounded-xl">
              <div>
                <p className="font-bold text-[var(--text-primary)] mb-1">Cloudflare R2</p>
                <p className="text-xs text-[var(--text-muted)]">Object storage for file uploads.</p>
              </div>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettingsPage
