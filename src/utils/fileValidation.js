// ─── Max File Size ────────────────────────────────────────────────────────────
export const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1024 // 1 GB

// ─── Validation ────────────────────────────────────────────────────────────────
// All file extensions and MIME types are accepted.
// Only size and presence are enforced.
export const validateFile = (file) => {
  const errors = []

  if (!file) {
    errors.push('No file provided')
    return { valid: false, errors }
  }

  // Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    errors.push('File size exceeds maximum allowed size of 1 GB')
  }

  if (file.size === 0) {
    errors.push('File is empty')
  }

  return { valid: errors.length === 0, errors }
}


// ─── Sanitize String ───────────────────────────────────────────────────────────
export const sanitizeString = (str) => {
  if (!str) return ''
  return str
    .trim()
    .replace(/[<>]/g, '') // remove potential HTML injection
    .slice(0, 1000)
}

// ─── Generate Safe Filename ───────────────────────────────────────────────────
export const generateSafeFilename = (originalName) => {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split('.').pop().toLowerCase()
  const baseName = originalName
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 50)
  return `${baseName}_${timestamp}_${randomSuffix}.${ext}`
}
