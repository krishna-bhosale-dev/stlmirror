import { useState, useCallback, useRef } from 'react'
import { supabase } from '../config/supabase'
import { aiToolsList } from '../data/aiToolsData'
import { allPosts as blogPosts } from '../data/blogData'

/**
 * useGlobalSearch — Searches across all content types
 */
export const useGlobalSearch = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Debounce timer reference
  const timerRef = useRef(null)

  const performSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    const q = query.toLowerCase().trim()
    setLoading(true)
    setError(null)
    
    try {
      // 1. Search Supabase tables (with fallback if they don't exist yet)
      const fetchSafe = async (table, select = 'id, title, category, created_at') => {
        try {
          const { data, error } = await supabase
            .from(table)
            .select(select)
            .ilike('title', `%${q}%`)
            .limit(10)
          if (error) {
            // Ignore missing table errors gracefully
            if (error.message?.includes('does not exist')) return []
            console.error(`Search error on ${table}:`, error)
            return []
          }
          return (data || []).map(item => ({ ...item, _type: table }))
        } catch (err) {
          return []
        }
      }

      const [files, premium, links, apks] = await Promise.all([
        fetchSafe('files', 'id, title, category, created_at, size, file_url'),
        fetchSafe('premium_downloads'),
        fetchSafe('website_links', 'id, title, category, created_at, url'),
        fetchSafe('apk_items')
      ])

      // 2. Search Static Data
      const aiResults = aiToolsList
        .filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)))
        .slice(0, 5)
        .map(t => ({ id: t.id, title: t.title, category: t.category, slug: t.slug, _type: 'ai_tools' }))

      const blogResults = blogPosts
        .filter(b => b.title.toLowerCase().includes(q) || b.excerpt?.toLowerCase().includes(q))
        .slice(0, 5)
        .map(b => ({ id: b.id, title: b.title, category: b.category, slug: b.slug, _type: 'blogs' }))

      // Combine and format
      const combined = [
        ...files,
        ...premium,
        ...links,
        ...apks,
        ...aiResults,
        ...blogResults
      ].sort((a, b) => {
        // Simple relevance: exact match first, then alphabetically
        const aTitle = a.title.toLowerCase()
        const bTitle = b.title.toLowerCase()
        if (aTitle === q) return -1
        if (bTitle === q) return 1
        return aTitle.localeCompare(bTitle)
      })

      setResults(combined)
    } catch (err) {
      console.error('Global search error:', err)
      setError('An error occurred while searching.')
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedSearch = useCallback((query) => {
    setLoading(true) // Immediate feedback
    if (timerRef.current) clearTimeout(timerRef.current)
    
    if (!query || query.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    timerRef.current = setTimeout(() => {
      performSearch(query)
    }, 300) // 300ms debounce
  }, [performSearch])

  return {
    results,
    loading,
    error,
    search: debouncedSearch
  }
}
