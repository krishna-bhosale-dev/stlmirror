import { useState, useRef } from 'react'
import { Smartphone, ExternalLink, Upload, X, Save, AlertCircle, Link2, FileUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCrud } from '../../hooks/useCrud'
import { useAuth } from '../../context/AuthContext'
import { generateSafeFilename } from '../../utils/fileValidation'
import CrudTable from '../../components/admin/CrudTable'

// ─── R2 API base ──────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE || ''

// ─── Upload APK file to Cloudflare R2, returns public URL ────────────────────
async function uploadApkToR2(file, token) {
  // ── Validate preconditions ────────────────────────────────────────────────
  if (!file) throw new Error('No APK file provided')
  if (!token) throw new Error('Not authenticated — please log out and log back in')
  if (file.size === 0) throw new Error('APK file is empty (0 bytes)')
  if (file.size > 1024 * 1024 * 1024) throw new Error(`APK file too large: ${(file.size / 1024 / 1024).toFixed(1)} MB (max 1 GB)`)

  const safeFilename = generateSafeFilename(file.name)
  const contentType = file.type || 'application/vnd.android.package-archive'

  // DEBUG: log what we're about to upload
  console.log('[APK Upload] File:', file.name, '|', (file.size / 1024 / 1024).toFixed(2), 'MB | type:', contentType)
  console.log('[APK Upload] Safe filename:', safeFilename)

  // ── Phase 0: Pre-flight Health Check ──────────────────────────────────────
  console.log('[APK Upload] Running pre-flight R2 health check...')
  try {
    const healthRes = await fetch(`${API_BASE}/api/r2-health`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const healthData = await healthRes.json().catch(() => null)
    if (!healthRes.ok || (healthData && !healthData.ok)) {
      const msg = healthData?.error || `Health check failed with HTTP ${healthRes.status}`
      const hint = healthData?.hint ? `\nHint: ${healthData.hint}` : ''
      throw new Error(`[Pre-flight Error] ${msg}${hint}`)
    }
    console.log('[APK Upload] Health check passed:', healthData)
  } catch (err) {
    if (err.message.includes('[Pre-flight Error]')) throw err
    console.warn('[APK Upload] Health check unreachable, proceeding anyway...', err)
  }

  // ── Phase 1: Get presigned PUT URL from our API ───────────────────────────
  console.log('[APK Upload] Requesting presigned URL from:', `${API_BASE}/api/upload`)
  let presignData
  try {
    const presignRes = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key: safeFilename, contentType }),
    })

    console.log('[APK Upload] Presign API response status:', presignRes.status)

    if (!presignRes.ok) {
      const body = await presignRes.json().catch(() => ({}))
      const msg = body.error || `API returned HTTP ${presignRes.status}`
      if (presignRes.status === 401) throw new Error(`Unauthorized — session may have expired. ${msg}`)
      if (presignRes.status === 403) throw new Error(`Access denied — admin only. ${msg}`)
      if (presignRes.status === 500) throw new Error(`Server error generating upload URL. ${msg}`)
      throw new Error(`Failed to get upload URL: ${msg}`)
    }

    presignData = await presignRes.json()
    console.log('[APK Upload] Presigned URL obtained. Public URL will be:', presignData.publicUrl)
  } catch (err) {
    // Re-throw fetch-level errors (e.g. server not running locally)
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error(
        'Cannot reach the upload API. ' +
        (window.location.hostname === 'localhost'
          ? 'Is the local API server running? Start it with: npm run server'
          : 'Check your network connection or try again.')
      )
    }
    throw err
  }

  const { presignedUrl, publicUrl } = presignData

  // ── Phase 2: PUT the raw APK bytes directly to R2 via presigned URL ───────
  // XHR is used so we can read the actual HTTP status on failure.
  // NOTE: If you see "Network error" here on localhost, it means the R2 bucket
  // CORS policy does not include http://localhost:5173.
  // Fix: Add localhost to the bucket CORS rules in the Cloudflare R2 dashboard.
  console.log('[APK Upload] Starting XHR PUT to R2 presigned URL…')

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.addEventListener('load', () => {
      console.log('[APK Upload] XHR load event — HTTP status:', xhr.status)
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        // Try to extract an error message from R2's XML error body
        let detail = `HTTP ${xhr.status}`
        try {
          const match = xhr.responseText.match(/<Message>([^<]+)<\/Message>/)
          if (match) detail += ` — R2: ${match[1]}`
        } catch {}
        if (xhr.status === 403) {
          reject(new Error(`R2 upload rejected (403 Forbidden). ${detail} — Check bucket credentials or CORS policy.`))
        } else if (xhr.status === 400) {
          reject(new Error(`R2 upload bad request (400). ${detail} — Presigned URL may be malformed.`))
        } else {
          reject(new Error(`R2 upload failed. ${detail}`))
        }
      }
    })

    xhr.addEventListener('error', () => {
      // XHR fires 'error' (not 'load') for network-level failures:
      //   • CORS preflight blocked by R2 (origin not in bucket CORS rules)
      //   • Connection refused / timeout
      //   • SSL certificate error
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (isLocalhost) {
        reject(new Error(
          'Upload blocked — R2 CORS does not allow localhost. ' +
          'Add http://localhost:5173 to the bucket CORS rules in the Cloudflare dashboard, ' +
          'or use an external URL instead. See console for details.'
        ))
      } else {
        reject(new Error(
          'Upload network error — the file could not be sent to Cloudflare R2. ' +
          'Possible causes: CORS policy, network interruption, or firewall. ' +
          'Check browser console → Network tab for the failed PUT request details.'
        ))
      }
      console.error('[APK Upload] XHR network error. Presigned URL host:', new URL(presignedUrl).hostname)
      console.error('[APK Upload] If this is a CORS error, add your origin to the R2 bucket CORS rules.')
    })

    xhr.addEventListener('abort', () => {
      console.warn('[APK Upload] XHR aborted')
      reject(new Error('Upload was cancelled'))
    })

    xhr.addEventListener('timeout', () => {
      console.warn('[APK Upload] XHR timed out')
      reject(new Error('Upload timed out — the file may be too large or the connection too slow'))
    })

    xhr.open('PUT', presignedUrl)
    xhr.setRequestHeader('Content-Type', contentType)
    // Do NOT set extra headers — only Content-Type is allowed by the presigned URL signature
    xhr.send(file)
    console.log('[APK Upload] XHR PUT sent, waiting for response…')
  })

  console.log('[APK Upload] ✅ Upload complete. Public URL:', publicUrl)
  return publicUrl
}

// ─── APK Modal ────────────────────────────────────────────────────────────────
const APK_CATEGORIES = ['Games', 'Productivity', 'Social', 'Tools', 'Media']

const ApkModal = ({ isOpen, onClose, editingItem, onCreate, onUpdate }) => {
  const { session } = useAuth()
  const token = session?.access_token

  const [formData, setFormData] = useState({})
  const [apkFile, setApkFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  // Seed form once per open
  const initializedRef = useRef(false)

  // Reset & seed when modal opens/closes
  if (isOpen && !initializedRef.current) {
    initializedRef.current = true
    const seed = editingItem
      ? { ...editingItem }
      : { title: '', package_name: '', version: '', category: APK_CATEGORIES[0], file_url: '', thumbnail_url: '', description: '' }
    setFormData(seed)
    setApkFile(null)
    setError(null)
  }
  if (!isOpen && initializedRef.current) {
    initializedRef.current = false
  }

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setApkFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const hasFile = !!apkFile
    const hasUrl = !!(formData.file_url || '').trim()

    // At least one download source required
    if (!hasFile && !hasUrl) {
      setError('Please either upload an APK file or provide an external download URL.')
      return
    }

    setUploading(true)
    try {
      let fileUrl = (formData.file_url || '').trim()

      // If a file is selected, upload it to R2 first (APK takes priority)
      if (hasFile) {
        fileUrl = await uploadApkToR2(apkFile, token)
      }

      const payload = {
        title: (formData.title || '').trim(),
        package_name: (formData.package_name || '').trim() || null,
        version: (formData.version || '').trim(),
        category: formData.category || APK_CATEGORIES[0],
        file_url: fileUrl,
        thumbnail_url: (formData.thumbnail_url || '').trim() || null,
        description: (formData.description || '').trim() || null,
      }

      const res = editingItem
        ? await onUpdate(editingItem.id, payload)
        : await onCreate(payload)

      if (res.success) {
        toast.success(editingItem ? 'App updated!' : 'App added successfully!')
        onClose()
      } else {
        setError(res.error || 'Failed to save')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={!uploading ? onClose : undefined}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border-glass)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-glass)] bg-[var(--bg-secondary)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {editingItem ? 'Edit' : 'Create'} Android App
            </h2>
            <button
              onClick={onClose} disabled={uploading}
              className="p-2 rounded-xl hover:bg-[var(--bg-primary)] transition-colors text-[var(--text-secondary)] hover:text-red-400 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Standard fields grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">
                  App Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" required
                  value={formData.title || ''}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="Enter app title..."
                  className="input-base w-full p-3 text-sm"
                />
              </div>

              {/* Package Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">
                  Package Name (e.g. com.example.app)
                </label>
                <input
                  type="text"
                  value={formData.package_name || ''}
                  onChange={e => handleChange('package_name', e.target.value)}
                  placeholder="com.example.app"
                  className="input-base w-full p-3 text-sm"
                />
              </div>

              {/* Version */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">
                  Version <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" required
                  value={formData.version || ''}
                  onChange={e => handleChange('version', e.target.value)}
                  placeholder="1.0.0"
                  className="input-base w-full p-3 text-sm"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.category || APK_CATEGORIES[0]}
                  onChange={e => handleChange('category', e.target.value)}
                  className="input-base w-full p-3 text-sm"
                >
                  {APK_CATEGORIES.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Icon / Thumbnail URL */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">
                  Icon URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnail_url || ''}
                  onChange={e => handleChange('thumbnail_url', e.target.value)}
                  placeholder="https://..."
                  className="input-base w-full p-3 text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  rows={3}
                  className="input-base w-full p-3 text-sm resize-y"
                  placeholder="Enter description..."
                />
              </div>
            </div>

            {/* ── Download Source Section ── */}
            <div className="rounded-xl border border-[var(--border-glass)] overflow-hidden">
              <div className="px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-glass)]">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Download Source <span className="text-red-400">*</span>
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Provide an APK file upload, an external URL, or both. The uploaded file takes priority if both are given.
                </p>
              </div>

              <div className="p-4 space-y-4">
                {/* APK File Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                    <FileUp className="w-4 h-4 text-[var(--accent-primary)]" />
                    Upload APK File
                    {apkFile && (
                      <span className="ml-auto text-xs text-green-400 font-normal">
                        ✓ {apkFile.name}
                      </span>
                    )}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".apk,application/vnd.android.package-archive"
                      onChange={handleFileChange}
                      className="hidden"
                      id="apk-file-input"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-dashed border-[var(--border-glass)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-glow)]"
                    >
                      <Upload className="w-4 h-4" />
                      {apkFile ? 'Change APK File' : 'Choose APK File'}
                    </button>
                    {apkFile && (
                      <button
                        type="button"
                        onClick={() => { setApkFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {apkFile && (
                    <p className="text-xs text-[var(--text-muted)] ml-1">
                      {(apkFile.size / 1024 / 1024).toFixed(1)} MB · Will be uploaded to Cloudflare R2
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--border-glass)]" />
                  <span className="text-xs font-medium text-[var(--text-muted)] px-1">OR</span>
                  <div className="flex-1 h-px bg-[var(--border-glass)]" />
                </div>

                {/* External Download URL */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                    <Link2 className="w-4 h-4 text-[var(--accent-secondary)]" />
                    External Download URL
                  </label>
                  <input
                    type="url"
                    value={formData.file_url || ''}
                    onChange={e => handleChange('file_url', e.target.value)}
                    placeholder="https://example.com/app.apk"
                    className="input-base w-full p-3 text-sm"
                  />
                  <p className="text-xs text-[var(--text-muted)] ml-1">
                    {apkFile
                      ? 'Ignored — uploaded APK file will be used as primary source.'
                      : 'Used as the download link if no APK file is uploaded.'}
                  </p>
                </div>
              </div>
            </div>

          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-glass)] bg-[var(--bg-secondary)]">
            <button
              type="button" onClick={onClose} disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              onClick={handleSubmit}
              className="btn-primary flex items-center gap-2 px-6 py-2 text-sm disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-white/20 animate-spin" />
                  {apkFile ? 'Uploading APK…' : 'Saving…'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ─── Admin APKs Page ──────────────────────────────────────────────────────────
const AdminApksPage = () => {
  const {
    items, loading, totalCount, page, setPage,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    create, update, remove, toggleFeatured, toggleStatus
  } = useCrud('apk_items')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const onClose = () => { setIsModalOpen(false); setEditingItem(null) }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this APK?')) {
      const res = await remove(id)
      if (res.success) toast.success('Deleted')
      else toast.error(res.error || 'Delete failed')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'App Name',
      render: (val, item) => (
        <div className="flex items-center gap-3">
          {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm max-w-[180px] truncate text-[var(--text-primary)]">{val}</p>
            <p className="text-xs text-[var(--text-muted)]">v{item.version || '1.0'}</p>
          </div>
        </div>
      )
    },
    { key: 'package_name', label: 'Package Name', render: (val) => <span className="text-xs text-[var(--text-muted)] font-mono">{val || '—'}</span> },
    { key: 'category', label: 'Category', render: (val) => <span className="text-xs">{val}</span> },
    {
      key: 'file_url',
      label: 'APK Link',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline max-w-[120px] truncate text-xs">
          Download <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      ) : '—'
    },
    { key: 'downloads', label: 'DLs', render: (val) => <span className="text-xs text-[var(--text-muted)]">{val || 0}</span> }
  ]

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Android Apps</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage Android app listings. Upload an APK file or provide an external download link.</p>
      </div>

      <div className="flex-1 min-h-0">
        <CrudTable
          items={items} loading={loading} totalCount={totalCount} columns={columns}
          page={page} setPage={setPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onAddNew={() => { setEditingItem(null); setIsModalOpen(true) }}
          onEdit={(item) => { setEditingItem(item); setIsModalOpen(true) }}
          onDelete={handleDelete} onToggleFeatured={toggleFeatured} onToggleStatus={toggleStatus}
          addButtonText="Add App"
        />
      </div>

      <ApkModal
        isOpen={isModalOpen}
        onClose={onClose}
        editingItem={editingItem}
        onCreate={create}
        onUpdate={update}
      />
    </div>
  )
}

export default AdminApksPage
