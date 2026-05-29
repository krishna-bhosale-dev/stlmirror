import { FileText, Image, Film, Archive, File, FileCode, Smartphone, Music } from 'lucide-react'

// ─── File Size Formatter ──────────────────────────────────────────────────────
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
}

// ─── Date Formatter ──────────────────────────────────────────────────────────
export const formatDate = (isoString) => {
  if (!isoString) return 'Unknown'
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const formatRelativeDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// ─── Download Count Formatter ──────────────────────────────────────────────────
export const formatDownloads = (count) => {
  if (!count) return '0'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return String(count)
}

// ─── Extension → Color Class ──────────────────────────────────────────────────
export const getExtensionColor = (ext) => {
  const extension = (ext || '').toLowerCase().replace('.', '')
  const colorMap = {
    // Images
    jpg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    jpeg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    png: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    gif: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    webp: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    svg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    // Documents
    pdf: 'bg-red-500/20 text-red-400 border-red-500/30',
    docx: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    doc: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pptx: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    ppt: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    xlsx: 'bg-green-500/20 text-green-400 border-green-500/30',
    txt: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    // Archives
    zip: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    rar: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    '7z': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    tar: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    // Videos
    mp4: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    mov: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    avi: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    mkv: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    // Apps
    apk: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    exe: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    dmg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    // Audio
    mp3: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    wav: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  }
  return colorMap[extension] || 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
}

// ─── Extension → Icon Component ──────────────────────────────────────────────
export const getFileIconComponent = (ext) => {
  const extension = (ext || '').toLowerCase().replace('.', '')
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm']
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
  const codeExts = ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'json', 'xml']
  const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg']
  const appExts = ['apk', 'exe', 'dmg', 'deb', 'rpm', 'msi']

  if (imageExts.includes(extension)) return Image
  if (videoExts.includes(extension)) return Film
  if (archiveExts.includes(extension)) return Archive
  if (codeExts.includes(extension)) return FileCode
  if (audioExts.includes(extension)) return Music
  if (appExts.includes(extension)) return Smartphone
  if (extension === 'pdf') return FileText
  return File
}

// ─── Category from Extension ──────────────────────────────────────────────────
export const getCategoryFromExtension = (ext) => {
  const extension = (ext || '').toLowerCase().replace('.', '')
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'webm']
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz']
  const docExts = ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'txt']
  const appExts = ['apk', 'exe', 'dmg', 'deb']

  if (imageExts.includes(extension)) return 'Images'
  if (videoExts.includes(extension)) return 'Videos'
  if (archiveExts.includes(extension)) return 'Archives'
  if (docExts.includes(extension)) return 'Documents'
  if (appExts.includes(extension)) return 'Apps'
  return 'Other'
}

// ─── Check if file is previewable ────────────────────────────────────────────
export const isImage = (ext) =>
  ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes((ext || '').toLowerCase())

export const isPDF = (ext) => (ext || '').toLowerCase() === 'pdf'

export const isVideo = (ext) =>
  ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes((ext || '').toLowerCase())
