import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Upload, LogOut, Trash2, Edit2, Star, StarOff,
  X, Check, Files, HardDrive, TrendingUp, CloudUpload,
  Loader2, Home, Lock,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../hooks/useAdmin'
import { formatFileSize, formatDate, getExtensionColor } from '../utils/formatters'

// ─── Upload Form ──────────────────────────────────────────────────────────────
const UploadForm = ({ onUpload, uploading, uploadProgress }) => {
  const [file, setFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      const f = accepted[0]
      setFile(f)
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''))
    }
  }, [title])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxFiles: 1, multiple: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Please select a file')
    const res = await onUpload({ file, title, description, category, thumbnailFile })
    if (res.success) {
      toast.success(`"${title || file.name}" uploaded successfully!`)
      setFile(null); setThumbnailFile(null); setTitle(''); setDescription(''); setCategory('')
    } else {
      toast.error(res.error || 'Upload failed')
    }
  }

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <CloudUpload className="w-5 h-5" style={{ color: '#a78bfa' }} />
        </div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Upload New File</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          id="file-dropzone"
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
          style={{
            borderColor: isDragActive ? 'var(--accent-primary)' : file ? 'rgba(34,197,94,0.4)' : 'var(--border-glass)',
            background: isDragActive ? 'var(--accent-glow)' : file ? 'rgba(34,197,94,0.05)' : 'transparent',
          }}
        >
          <input {...getInputProps()} id="file-input" />
          {file ? (
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <Check className="w-6 h-6" style={{ color: '#4ade80' }} />
                </div>
              </div>
              <p className="font-semibold text-sm truncate max-w-xs mx-auto" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatFileSize(file.size)}</p>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="text-xs transition-colors" style={{ color: '#f87171' }}>
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Upload className="w-10 h-10" style={{ color: isDragActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {isDragActive ? 'Drop file here…' : 'Drag & drop or click to browse'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Max 1 GB · All file types supported</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {uploading && uploadProgress > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Uploading…</span><span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Title *</label>
          <input id="upload-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="File display name" required className="input-base w-full px-4 py-2.5 text-sm" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Description *</label>
          <textarea id="upload-description" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the file…" rows={4} required maxLength={1500}
            className="input-base w-full px-4 py-2.5 text-sm resize-none" />
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Thumbnail Image (Optional)</label>
          <input type="file" accept="image/jpeg, image/png, image/webp" 
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            className="input-base w-full px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[var(--accent-glow)] file:text-[var(--accent-primary)] hover:file:bg-[var(--bg-secondary)]" />
          {thumbnailFile && <p className="text-xs" style={{ color: 'var(--accent-primary)' }}>Selected: {thumbnailFile.name}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Category</label>
          <select id="upload-category" value={category} onChange={(e) => setCategory(e.target.value)}
            className="input-base w-full px-4 py-2.5 text-sm">
            <option value="">Auto-detect from extension</option>
            {['Images', 'Documents', 'Videos', 'Archives', 'Apps', 'Audio', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button type="submit" id="upload-submit-btn" disabled={uploading || !file}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm">
          {uploading
            ? <><Loader2 className="w-4 h-4 spinner" />Uploading…</>
            : <><Upload className="w-4 h-4" />Upload File</>
          }
        </button>
      </form>
    </div>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ file, onSave, onClose }) => {
  const [title, setTitle] = useState(file.title || '')
  const [description, setDescription] = useState(file.description || '')
  const [category, setCategory] = useState(file.category || '')
  const [isFeatured, setIsFeatured] = useState(file.is_featured || false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const res = await onSave(file.id, { title, description, category, is_featured: isFeatured })
    setSaving(false)
    if (res.success) { toast.success('File updated!'); onClose() }
    else toast.error(res.error || 'Update failed')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Edit File</h3>
          <button onClick={onClose} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <input id="edit-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Title" className="input-base w-full px-4 py-2.5 text-sm" />
          <textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Description" rows={3} className="input-base w-full px-4 py-2.5 text-sm resize-none" />
          <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)}
            className="input-base w-full px-4 py-2.5 text-sm">
            <option value="">Select category</option>
            {['Images', 'Documents', 'Videos', 'Archives', 'Apps', 'Audio', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setIsFeatured(p => !p)}
              className="w-10 h-6 rounded-full transition-colors"
              style={{ background: isFeatured ? '#eab308' : 'var(--bg-secondary)' }}>
              <div className={`w-4 h-4 rounded-full bg-white shadow mt-1 transition-transform ${isFeatured ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mark as Featured</span>
          </label>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button id="edit-save-btn" onClick={handleSave} disabled={saving}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 spinner" /> : <Check className="w-4 h-4" />}
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── File Row ─────────────────────────────────────────────────────────────────
const FileRow = ({ file, onEdit, onDelete, onToggleFeatured }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const ext = (file.file_extension || '').toLowerCase()
  const extColor = getExtensionColor(ext)

  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="border-b transition-colors"
      style={{ borderColor: 'var(--border-glass)' }}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className={`ext-badge shrink-0 ${extColor}`}>.{ext}</span>
          <div>
            <p className="text-sm font-medium line-clamp-1 max-w-[180px]" style={{ color: 'var(--text-primary)' }}>{file.title}</p>
            <p className="text-xs truncate max-w-[180px]" style={{ color: 'var(--text-muted)' }}>{file.original_filename}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{file.category || '—'}</td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{formatFileSize(file.file_size)}</td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{file.downloads || 0}</td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(file.created_at)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onToggleFeatured(file.id, file.is_featured)} title={file.is_featured ? 'Unfeature' : 'Feature'}
            className="p-1.5 rounded-lg transition-all"
            style={{
              color: file.is_featured ? '#facc15' : 'var(--text-muted)',
              background: file.is_featured ? 'rgba(234,179,8,0.1)' : 'transparent',
            }}>
            {file.is_featured ? <Star className="w-4 h-4" style={{ fill: '#facc15' }} /> : <StarOff className="w-4 h-4" />}
          </button>
          <button onClick={() => onEdit(file)} title="Edit"
            className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--text-muted)' }}>
            <Edit2 className="w-4 h-4" />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={() => { onDelete(file.id, file.file_name); setConfirmDelete(false) }}
                className="px-2 py-1 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                Confirm
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 rounded-lg text-xs" style={{ color: 'var(--text-muted)' }}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} title="Delete"
              className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--text-muted)' }}>
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  )
}

// ─── Secure Admin Dashboard ───────────────────────────────────────────────────
const SecureAdminPage = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { files, loading, uploading, uploadProgress, uploadFile, updateFile, deleteFile, toggleFeatured } = useAdmin()
  const [editingFile, setEditingFile] = useState(null)
  const [tableSearch, setTableSearch] = useState('')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleDelete = async (id, fileName) => {
    const res = await deleteFile(id, fileName)
    if (res.success) toast.success('File deleted')
    else toast.error(res.error || 'Delete failed')
  }

  const handleToggleFeatured = async (id, current) => {
    const res = await toggleFeatured(id, current)
    if (res.success) toast.success(current ? 'Removed from featured' : 'Marked as featured!')
    else toast.error('Failed to update')
  }

  const filteredFiles = files.filter((f) =>
    !tableSearch || (f.title || '').toLowerCase().includes(tableSearch.toLowerCase())
  )

  const totalDownloads = files.reduce((acc, f) => acc + (f.downloads || 0), 0)
  const totalSize = files.reduce((acc, f) => acc + (f.file_size || 0), 0)

  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Lock className="w-5 h-5" style={{ color: '#a78bfa' }} />
              </div>
              <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
                ● Secure
              </span>
            </div>
            <p className="text-sm ml-12" style={{ color: 'var(--text-muted)' }}>
              Authenticated as <span style={{ color: 'var(--accent-primary)' }}>{user?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
              <Home className="w-4 h-4" />
              View Site
            </button>
            <button onClick={handleSignOut} id="admin-signout-btn"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: '#f87171' }}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Files', value: files.length, Icon: Files, color: 'rgba(139,92,246,', textColor: '#a78bfa' },
            { label: 'Total Downloads', value: totalDownloads.toLocaleString(), Icon: TrendingUp, color: 'rgba(6,182,212,', textColor: '#22d3ee' },
            { label: 'Storage Used', value: formatFileSize(totalSize), Icon: HardDrive, color: 'rgba(249,115,22,', textColor: '#fb923c' },
            { label: 'Featured', value: files.filter(f => f.is_featured).length, Icon: Star, color: 'rgba(234,179,8,', textColor: '#facc15' },
          ].map(({ label, value, Icon, color, textColor }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: `${color}0.1)`, border: `1px solid ${color}0.2)` }}>
                <Icon className="w-5 h-5" style={{ color: textColor }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Upload + Table ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <UploadForm onUpload={uploadFile} uploading={uploading} uploadProgress={uploadProgress} />
          </div>

          <div className="lg:col-span-3">
            <div className="card overflow-hidden">
              <div className="p-5 flex items-center justify-between gap-3"
                style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  All Files
                  <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>({filteredFiles.length})</span>
                </h2>
                <input type="text" value={tableSearch} onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search…" id="admin-table-search"
                  className="input-base px-3 py-2 text-xs w-36" />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-t-purple-500 rounded-full spinner"
                    style={{ borderColor: 'var(--border-glass)', borderTopColor: 'var(--accent-primary)' }} />
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
                  <Files className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No files yet. Upload your first file!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        {['File', 'Category', 'Size', 'DLs', 'Date', 'Actions'].map((h) => (
                          <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredFiles.map((file) => (
                          <FileRow key={file.id} file={file} onEdit={setEditingFile}
                            onDelete={handleDelete} onToggleFeatured={handleToggleFeatured} />
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingFile && (
          <EditModal file={editingFile} onSave={updateFile} onClose={() => setEditingFile(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SecureAdminPage
