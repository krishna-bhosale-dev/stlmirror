import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Download, Share2, Copy, ArrowLeft, Calendar,
  HardDrive, Eye, Star, Tag, User, ExternalLink
} from 'lucide-react'
import { useFileDetail } from '../hooks/useFileDetail'
import FilePreview from '../components/files/FilePreview'
import FileCard from '../components/files/FileCard'
import {
  formatFileSize, formatDate, formatDownloads,
  getExtensionColor,
} from '../utils/formatters'

const MetaRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-[var(--border-glass)] last:border-0">
    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    <span className="text-sm font-medium text-[var(--text-primary)] text-right max-w-[60%] truncate">
      {value || '—'}
    </span>
  </div>
)

const FileDetailPage = () => {
  const { id } = useParams()
  const { file, related, loading, error, incrementDownloads } = useFileDetail(id)

  const handleDownload = () => {
    if (!file?.file_url) return
    incrementDownloads()
    const a = document.createElement('a')
    a.href = file.file_url
    a.download = file.original_filename || file.file_name
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Download started!')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: file?.title,
          text: file?.description || `Download ${file?.title} on STL_Mirror`,
          url: window.location.href,
        })
      } catch { /* share cancelled */ }
    } else {
      handleCopyLink()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--border-glass)] border-t-[var(--accent-primary)] rounded-full spinner" />
      </div>
    )
  }

  if (error || !file) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">File Not Found</h1>
        <p className="text-[var(--text-muted)] max-w-sm">{error || "This file doesn't exist or has been removed."}</p>
        <Link to="/" className="btn-primary px-6 py-3 mt-2 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    )
  }

  const ext = (file.file_extension || '').toLowerCase()
  const extColor = getExtensionColor(ext)

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-6 text-sm text-[var(--text-muted)]"
        >
          <Link to="/" className="flex items-center gap-1 hover:text-[var(--accent-primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All Files
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-medium truncate max-w-xs">{file.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ─── Preview Panel ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Featured badge */}
            {file.is_featured && (
              <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                Featured File
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight">
              {file.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
              <span className={`ext-badge ${extColor}`}>.{ext}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(file.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                {formatDownloads(file.downloads)} downloads
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {formatDownloads(file.views)} views
              </span>
            </div>

            {/* Preview */}
            <div className="card overflow-hidden p-0">
              <FilePreview
                file={file}
                className="w-full min-h-[350px] max-h-[600px]"
              />
            </div>

            {/* Description */}
            {file.description && (
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  About This File
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                  {file.description}
                </p>
              </div>
            )}
          </motion.div>

          {/* ─── Info & Actions Sidebar ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="space-y-3">
              {/* Download Button */}
              <button
                onClick={handleDownload}
                id="download-file-btn"
                className="btn-primary w-full flex items-center justify-center gap-3 px-6 py-4 text-base rounded-xl glow-sm"
              >
                <Download className="w-5 h-5" />
                Download File
                <span className="ml-auto text-xs opacity-70">{formatFileSize(file.file_size)}</span>
              </button>

              {/* Monetag Direct Link */}
              <a
                href="https://crn77.com/4/11096582"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Support STLMirror (Alternative Link)
              </a>
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                id="copy-link-btn"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
              <button
                onClick={handleShare}
                id="share-file-btn"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* File Metadata */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                File Details
              </h2>
              <div>
                <MetaRow icon={Tag} label="Category" value={file.category} />
                <MetaRow icon={HardDrive} label="File Size" value={formatFileSize(file.file_size)} />
                <MetaRow icon={Tag} label="Extension" value={`.${ext}`} />
                <MetaRow icon={Calendar} label="Uploaded" value={formatDate(file.created_at)} />
                <MetaRow icon={User} label="Uploaded by" value={file.uploaded_by} />
                <MetaRow icon={Eye} label="Views" value={formatDownloads(file.views)} />
                <MetaRow icon={Download} label="Downloads" value={formatDownloads(file.downloads)} />
              </div>
            </div>

            {/* Direct link */}
            <div className="card p-4">
              <p className="text-xs text-[var(--text-muted)] mb-2 font-medium uppercase tracking-wider">
                Direct Link
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={file.file_url || ''}
                  className="input-base text-xs px-3 py-2 flex-1 min-w-0"
                  onClick={(e) => e.target.select()}
                />
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-glass)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Related Files ───────────────────────────────────── */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Related Files</h2>
              <div className="flex-1 h-px bg-[var(--border-glass)]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((f) => (
                <FileCard key={f.id} file={f} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default FileDetailPage
