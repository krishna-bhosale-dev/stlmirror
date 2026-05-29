import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Star, Calendar, HardDrive } from 'lucide-react'
import {
  getExtensionColor,
  getFileIconComponent,
  formatFileSize,
  formatRelativeDate,
  formatDownloads,
  isImage,
} from '../../utils/formatters'

import React from 'react'
// Defined outside the component so ESLint doesn't flag it as "created during render"
// We use React.createElement to avoid the static-components lint rule on JSX variables
const FileTypeIcon = ({ ext, ...props }) =>
  React.createElement(getFileIconComponent(ext), props)

const FileCard = ({ file, onDownload }) => {
  const [imgError, setImgError] = useState(false)
  const ext = (file.file_extension || '').toLowerCase()
  const extColor = getExtensionColor(ext)
  const showThumbnail = isImage(ext) && file.file_url && !imgError

  const handleDownload = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDownload) onDownload(file)
    window.open(file.file_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      <Link to={`/file/${file.id}`} className="block">
        <div className="card overflow-hidden cursor-pointer relative">
          {/* Featured badge */}
          {file.is_featured && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400" />
              Featured
            </div>
          )}

          {/* Thumbnail / Icon area */}
          <div className="relative h-48 overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center">
            {showThumbnail ? (
              <img
                src={file.file_url}
                alt={file.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="p-5 rounded-2xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}
                >
                  <FileTypeIcon ext={ext} className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
                  .{ext}
                </span>
              </div>
            )}

            {/* Gradient overlay on image */}
            {showThumbnail && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </div>

          {/* Card body */}
          <div className="p-4 space-y-3">
            {/* Extension badge + date */}
            <div className="flex items-center justify-between">
              <span className={`ext-badge ${extColor}`}>.{ext}</span>
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Calendar className="w-3 h-3" />
                {formatRelativeDate(file.created_at)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors">
              {file.title || file.original_filename}
            </h3>

            {/* Stats + Download */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {formatDownloads(file.downloads)}
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  {formatFileSize(file.file_size)}
                </span>
              </div>

              <button
                onClick={handleDownload}
                id={`download-${file.id}`}
                className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
                aria-label={`Download ${file.title}`}
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default FileCard
