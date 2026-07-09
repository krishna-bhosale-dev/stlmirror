import { useState } from 'react'
import { LinkIcon, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCrud } from '../../hooks/useCrud'
import CrudTable from '../../components/admin/CrudTable'
import CrudModal from '../../components/admin/CrudModal'

const AdminWebsiteLinksPage = () => {
  const {
    items, loading, totalCount, page, setPage,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    create, update, remove, toggleFeatured, toggleStatus
  } = useCrud('website_links')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleSave = async (data) => {
    const res = editingItem ? await update(editingItem.id, data) : await create(data)
    if (res.success) { toast.success('Saved successfully'); onClose() }
    return res
  }
  const onClose = () => setIsModalOpen(false)

  const handleDelete = async (id) => {
    if (window.confirm('Delete this link?')) {
      const res = await remove(id)
      if (res.success) toast.success('Deleted')
      else toast.error(res.error || 'Delete failed')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Website Name',
      render: (val, item) => (
        <div className="flex items-center gap-3">
          {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
              <LinkIcon className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm max-w-[200px] truncate">{val}</p>
            <p className="text-xs text-[var(--text-muted)]">{item.category}</p>
          </div>
        </div>
      )
    },
    {
      key: 'url',
      label: 'URL',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline max-w-[200px] truncate">
          {val.replace(/^https?:\/\//, '')} <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      ) : '—'
    },
    { key: 'clicks', label: 'Clicks', render: (val) => <span className="text-[var(--text-muted)]">{val || 0}</span> }
  ]

  const fields = [
    { key: 'title', label: 'Website Title', required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['Design', 'Development', 'Marketing', 'Productivity', 'Other'], required: true },
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'thumbnail_url', label: 'Logo / Thumbnail URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea', fullWidth: true }
  ]

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Web Directory</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage your website bookmarks and resource links.</p>
      </div>

      <div className="flex-1 min-h-0">
        <CrudTable
          items={items} loading={loading} totalCount={totalCount} columns={columns}
          page={page} setPage={setPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onAddNew={() => { setEditingItem(null); setIsModalOpen(true) }}
          onEdit={(item) => { setEditingItem(item); setIsModalOpen(true) }}
          onDelete={handleDelete} onToggleFeatured={toggleFeatured} onToggleStatus={toggleStatus}
          addButtonText="Add Link"
        />
      </div>

      <CrudModal isOpen={isModalOpen} onClose={onClose} title="Website Link" initialData={editingItem} fields={fields} onSave={handleSave} />
    </div>
  )
}

export default AdminWebsiteLinksPage
