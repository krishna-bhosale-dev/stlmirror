import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from '../context/AuthContext'

const PAGE_SIZE = 15

/**
 * useCrud — Generic CRUD hook for any Supabase table.
 *
 * Usage:
 *   const crud = useCrud('premium_downloads')
 *
 * Returns: { items, loading, error, totalCount, hasMore,
 *             page, setPage, searchQuery, setSearchQuery,
 *             create, update, remove, toggleFeatured, toggleStatus,
 *             refetch }
 */
export const useCrud = (tableName) => {
  const { session } = useAuth()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'draft' | 'published'

  // ── Fetch ────────────────────────────────────────────────────
  const fetchItems = useCallback(async (reset = false) => {
    setLoading(true)
    setError(null)
    try {
      const currentPage = reset ? 0 : page
      const from = currentPage * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      query = query.range(from, to)

      const { data, error: fetchError, count } = await query
      if (fetchError) throw fetchError

      setTotalCount(count || 0)
      setItems(reset ? (data || []) : (prev) => [...prev, ...(data || [])])
      if (reset) setPage(0)
    } catch (err) {
      // Table might not exist yet — fail gracefully
      if (err.message?.includes('does not exist')) {
        setItems([])
        setTotalCount(0)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [tableName, searchQuery, statusFilter, page])

  useEffect(() => {
    fetchItems(true)
    setPage(0)
  }, [tableName, searchQuery, statusFilter]) // eslint-disable-line

  // ── Create ───────────────────────────────────────────────────
  const create = async (fields) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert({ ...fields })
        .select()
        .single()
      if (error) throw error
      setItems((prev) => [data, ...prev])
      setTotalCount((n) => n + 1)
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // ── Update ───────────────────────────────────────────────────
  const update = async (id, fields) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update({ ...fields })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setItems((prev) => prev.map((item) => (item.id === id ? data : item)))
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // ── Remove ───────────────────────────────────────────────────
  const remove = async (id) => {
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id)
      if (error) throw error
      setItems((prev) => prev.filter((item) => item.id !== id))
      setTotalCount((n) => Math.max(0, n - 1))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // ── Toggle featured ──────────────────────────────────────────
  const toggleFeatured = async (id, current) => update(id, { is_featured: !current })

  // ── Toggle status ────────────────────────────────────────────
  const toggleStatus = async (id, current) =>
    update(id, { status: current === 'published' ? 'draft' : 'published' })

  return {
    items,
    loading,
    error,
    totalCount,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    create,
    update,
    remove,
    toggleFeatured,
    toggleStatus,
    refetch: () => fetchItems(true),
  }
}
