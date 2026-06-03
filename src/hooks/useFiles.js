import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../config/supabase'

const PAGE_SIZE = 12

export const useFiles = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const fetchFiles = useCallback(async (reset = false) => {
    setLoading(true)
    setError(null)

    try {
      const currentPage = reset ? 0 : page
      const from = currentPage * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('files')
        .select('*', { count: 'exact' })

      // Search
      if (searchQuery.trim()) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        )
      }

      // Category filter
      if (category !== 'all') {
        const categoryMap = {
          images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
          documents: ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'txt'],
          videos: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
          archives: ['zip', 'rar', '7z', 'tar', 'gz'],
          apps: ['apk', 'exe', 'dmg'],
        }

        if (category === 'featured') {
          query = query.eq('is_featured', true)
        } else if (categoryMap[category]) {
          query = query.in('file_extension', categoryMap[category])
        }
      }

      // Sort
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'downloads':
          query = query.order('downloads', { ascending: false })
          break
        case 'size':
          query = query.order('file_size', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      query = query.range(from, to)

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError

      setTotalCount(count || 0)
      setFiles(reset ? (data || []) : (prev) => [...prev, ...(data || [])])
      setHasMore((from + PAGE_SIZE) < (count || 0))

      if (reset) setPage(0)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, category, sortBy, page])

  // Refetch when filters change
  useEffect(() => {
    fetchFiles(true) // eslint-disable-line react-hooks/set-state-in-effect
    setPage(0)
  }, [searchQuery, category, sortBy]) // eslint-disable-line

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
  }

  useEffect(() => {
    if (page > 0) fetchFiles(false) // eslint-disable-line react-hooks/set-state-in-effect
  }, [page]) // eslint-disable-line

  // Trending files (most downloaded)
  const [trending, setTrending] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      setTrendingLoading(true)
      const { data } = await supabase
        .from('files')
        .select('*')
        .order('downloads', { ascending: false })
        .limit(6)
      setTrending(data || [])
      setTrendingLoading(false)
    }
    fetchTrending()
  }, [])

  return {
    files,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    trending,
    trendingLoading,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
    refetch: () => fetchFiles(true),
  }
}
