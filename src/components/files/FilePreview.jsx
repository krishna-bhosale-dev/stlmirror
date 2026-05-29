import { isImage, isPDF, isVideo } from '../../utils/formatters'
import { File, FileText, Archive, Smartphone, Film, Music } from 'lucide-react'

const FilePreview = ({ file, className = '' }) => {
  const ext = (file?.file_extension || '').toLowerCase()
  const url = file?.file_url

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-[var(--bg-secondary)] rounded-xl ${className}`}>
        <File className="w-16 h-16 text-[var(--text-muted)]" />
      </div>
    )
  }

  if (isImage(ext)) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <img
          src={url}
          alt={file.title || file.original_filename}
          className="w-full h-full object-contain bg-[var(--bg-secondary)]"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling?.style.removeProperty('display')
          }}
        />
        <div className="hidden items-center justify-center w-full h-full bg-[var(--bg-secondary)] absolute inset-0">
          <File className="w-16 h-16 text-[var(--text-muted)]" />
        </div>
      </div>
    )
  }

  if (isPDF(ext)) {
    return (
      <div className={`overflow-hidden rounded-xl ${className}`}>
        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full"
          title={file.title}
          loading="lazy"
        />
      </div>
    )
  }

  if (isVideo(ext)) {
    return (
      <div className={`overflow-hidden rounded-xl bg-black ${className}`}>
        <video
          controls
          className="w-full h-full object-contain"
          preload="metadata"
        >
          <source src={url} type={file.mime_type || `video/${ext}`} />
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  // Fallback: show icon
  const iconMap = {
    pdf: { Icon: FileText, color: 'text-red-400', label: 'PDF Document' },
    zip: { Icon: Archive, color: 'text-yellow-400', label: 'ZIP Archive' },
    rar: { Icon: Archive, color: 'text-yellow-400', label: 'RAR Archive' },
    apk: { Icon: Smartphone, color: 'text-cyan-400', label: 'Android App' },
    mp4: { Icon: Film, color: 'text-purple-400', label: 'Video File' },
    mp3: { Icon: Music, color: 'text-pink-400', label: 'Audio File' },
  }

  const { Icon = File, color = 'text-[var(--text-muted)]', label = 'File' } =
    iconMap[ext] || {}

  return (
    <div className={`flex flex-col gap-3 items-center justify-center bg-[var(--bg-secondary)] rounded-xl ${className}`}>
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)]">
        <Icon className={`w-20 h-20 ${color}`} />
      </div>
      <p className="text-[var(--text-secondary)] font-medium">{label}</p>
      <p className="text-[var(--text-muted)] text-sm font-mono">.{ext}</p>
    </div>
  )
}

export default FilePreview
