import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../config/supabase'
import { validateFile, generateSafeFilename, sanitizeString } from '../utils/fileValidation'
import { getCategoryFromExtension } from '../utils/formatters'
import { useAuth } from '../context/AuthContext'

// ─── R2 API base (proxied through Vite dev server, same origin in production) ─
const API_BASE = import.meta.env.VITE_API_BASE || ''

export const useAdmin = () => {
  const { session } = useAuth()
  const token = session?.access_token

  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fetchAdminFiles = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setFiles(data || [])
    else setError(error.message)
    setLoading(false)
  }, [])

  useEffect(() => { fetchAdminFiles() }, [fetchAdminFiles]) // eslint-disable-line react-hooks/set-state-in-effect

  // ─── Upload File to Cloudflare R2 (presigned URL flow) ───────────
  //
  //  Phase 1 — POST JSON { key, contentType } to /api/upload
  //            Server validates JWT, returns { presignedUrl, publicUrl }
  //            R2 credentials NEVER reach the browser.
  //
  //  Phase 2 — XHR PUT the raw file bytes directly to the presigned URL
  //            Bypasses Vercel 4.5 MB body limit; progress events still work.
  //
  //  Phase 3 — Insert metadata row into Supabase files table.
  //
  const uploadFile = async ({ file, title, description, category, thumbnailFile }) => {
    // Validate (size + presence only — all extensions accepted)
    const validation = validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') }
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : ''
      const safeFilename = generateSafeFilename(file.name)
      const contentType = file.type || 'application/octet-stream'

      // ── Phase 1: Request a presigned PUT URL from /api/upload ─────────────
      const presignRes = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ key: safeFilename, contentType }),
      })

      if (!presignRes.ok) {
        const body = await presignRes.json().catch(() => ({}))
        throw new Error(body.error || `Failed to get upload URL (HTTP ${presignRes.status})`)
      }

      const { presignedUrl, publicUrl } = await presignRes.json()
      setUploadProgress(5)

      // ── Phase 2: PUT the raw file directly to R2 via presigned URL ────────
      //            XHR is used so we can track upload progress.
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            // Scale 5 % → 85 % during the actual file transfer
            const pct = 5 + Math.round((e.loaded / e.total) * 80)
            setUploadProgress(pct)
          }
        })

        xhr.addEventListener('load', () => {
          // R2 returns 200 on success (presigned PUT)
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload to storage failed (HTTP ${xhr.status})`))
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

        xhr.open('PUT', presignedUrl)
        // Content-Type must match what was used to sign the URL
        xhr.setRequestHeader('Content-Type', contentType)
        xhr.send(file)   // send raw File, not FormData
      })

      setUploadProgress(90)

      // ── Phase 2.5: Upload Thumbnail if provided ───────────────────
      let thumbnailPublicUrl = null
      if (thumbnailFile) {
        const safeThumbName = `thumb_${Date.now()}_${generateSafeFilename(thumbnailFile.name)}`
        const thumbContentType = thumbnailFile.type || 'image/jpeg'

        const thumbPresignRes = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ key: safeThumbName, contentType: thumbContentType }),
        })

        if (thumbPresignRes.ok) {
          const { presignedUrl: tPresignedUrl, publicUrl: tPublicUrl } = await thumbPresignRes.json()
          
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) resolve()
              else reject(new Error('Thumbnail upload failed'))
            })
            xhr.addEventListener('error', () => reject(new Error('Network error during thumbnail upload')))
            xhr.addEventListener('abort', () => reject(new Error('Thumbnail upload aborted')))
            xhr.open('PUT', tPresignedUrl)
            xhr.setRequestHeader('Content-Type', thumbContentType)
            xhr.send(thumbnailFile)
          })
          thumbnailPublicUrl = tPublicUrl
        }
      }

      // ── Phase 3: Save metadata + R2 public URL to Supabase ───────────────
      const { data: dbData, error: dbError } = await supabase.from('files').insert({
        title: sanitizeString(title || file.name),
        description: sanitizeString(description || ''),
        category: sanitizeString(category || getCategoryFromExtension(ext)),
        original_filename: file.name,
        file_name: safeFilename,
        file_url: publicUrl,
        thumbnail_url: thumbnailPublicUrl,
        file_extension: ext,
        mime_type: contentType,
        file_size: file.size,
        uploaded_by: (await supabase.auth.getUser()).data?.user?.email || 'admin',
        downloads: 0,
        views: 0,
        is_featured: false,
      }).select().single()

      if (dbError) throw dbError

      setUploadProgress(100)
      setFiles((prev) => [dbData, ...prev])

      return { success: true, data: dbData }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // ─── Update File Metadata (Supabase DB only) ─────────────────────
  const updateFile = async (id, updates) => {
    const { data, error } = await supabase
      .from('files')
      .update({
        title: sanitizeString(updates.title),
        description: sanitizeString(updates.description),
        category: sanitizeString(updates.category),
        is_featured: updates.is_featured,
      })
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      setFiles((prev) => prev.map((f) => (f.id === id ? data : f)))
      return { success: true, data }
    }
    return { success: false, error: error.message }
  }

  // ─── Toggle Featured ─────────────────────────────────────────────
  const toggleFeatured = async (id, currentValue) => {
    return updateFile(id, { is_featured: !currentValue })
  }

  // ─── Delete File (R2 + Supabase DB) ──────────────────────────────
  const deleteFile = async (id, fileName) => {
    try {
      // 1. Delete object from Cloudflare R2
      if (fileName) {
        const headers = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        const res = await fetch(`${API_BASE}/api/delete/${encodeURIComponent(fileName)}`, {
          method: 'DELETE',
          headers,
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          console.warn('R2 delete warning:', body.error || `HTTP ${res.status}`)
          // Non-fatal: continue to delete DB row even if R2 object is already gone
        }
      }

      // 2. Delete metadata row from Supabase DB
      const { error } = await supabase.from('files').delete().eq('id', id)
      if (error) throw error

      setFiles((prev) => prev.filter((f) => f.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    files,
    loading,
    uploading,
    error,
    uploadProgress,
    uploadFile,
    updateFile,
    deleteFile,
    toggleFeatured,
    refetch: fetchAdminFiles,
  }
}
