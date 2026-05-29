import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useFileDetail = (id) => {
  const [file, setFile] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let mounted = true

    const fetchFile = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch file
        const { data, error: fetchError } = await supabase
          .from('files')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError
        if (!mounted) return

        setFile(data)

        // Increment views
        await supabase.rpc('increment_views', { file_id: id })

        // Fetch related files (same category, different id)
        if (data?.category) {
          const { data: relatedData } = await supabase
            .from('files')
            .select('*')
            .eq('category', data.category)
            .neq('id', id)
            .limit(4)

          if (mounted) setRelated(relatedData || [])
        }
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchFile()
    return () => { mounted = false }
  }, [id])

  const incrementDownloads = async () => {
    if (!id) return
    try {
      await supabase.rpc('increment_downloads', { file_id: id })
      setFile((prev) => prev ? { ...prev, downloads: (prev.downloads || 0) + 1 } : prev)
    } catch (err) {
      console.error('Failed to increment downloads:', err)
    }
  }

  return { file, related, loading, error, incrementDownloads }
}
