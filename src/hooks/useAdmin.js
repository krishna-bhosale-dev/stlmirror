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

  // ─── Upload File to Cloudflare R2 ────────────────────────────────
  const uploadFile = async ({ file, title, description, category }) => {
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

      // ── 1. Upload to R2 via Express proxy (XHR for progress events) ──
      const publicUrl = await new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('key', safeFilename)

        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            // Scale upload progress to 0–80%
            const pct = Math.round((e.loaded / e.total) * 80)
            setUploadProgress(pct)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const body = JSON.parse(xhr.responseText)
              if (body.url) resolve(body.url)
              else reject(new Error(body.error || 'Upload failed — no URL returned'))
            } catch {
              reject(new Error('Invalid response from upload server'))
            }
          } else {
            try {
              const body = JSON.parse(xhr.responseText)
              reject(new Error(body.error || `Upload failed (HTTP ${xhr.status})`))
            } catch {
              reject(new Error(`Upload failed (HTTP ${xhr.status})`))
            }
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

        xhr.open('POST', `${API_BASE}/api/upload`)
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        }
        xhr.send(formData)
      })

      setUploadProgress(85)

      // ── 2. Save metadata + R2 URL to Supabase DB ─────────────────────
      const { data: dbData, error: dbError } = await supabase.from('files').insert({
        title: sanitizeString(title || file.name),
        description: sanitizeString(description || ''),
        category: sanitizeString(category || getCategoryFromExtension(ext)),
        original_filename: file.name,
        file_name: safeFilename,
        file_url: publicUrl,
        file_extension: ext,
        mime_type: file.type || 'application/octet-stream',
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
