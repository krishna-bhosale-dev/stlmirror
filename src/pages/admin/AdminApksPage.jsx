import { useState } from 'react'
import { Smartphone, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCrud } from '../../hooks/useCrud'
import CrudTable from '../../components/admin/CrudTable'
import CrudModal from '../../components/admin/CrudModal'

const AdminApksPage = () => {
  const {
    items, loading, totalCount, page, setPage,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    create, update, remove, toggleFeatured, toggleStatus
  } = useCrud('apk_items')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleSave = async (data) => {
    const res = editingItem ? await update(editingItem.id, data) : await create(data)
    if (res.success) { toast.success('Saved successfully'); onClose() }
    return res
  }
  const onClose = () => setIsModalOpen(false)

  const handleDelete = async (id) => {
    if (window.confirm('Delete this APK?')) {
      const res = await remove(id)
      if (res.success) toast.success('Deleted')
      else toast.error(res.error || 'Delete failed')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'App Name',
      render: (val, item) => (
        <div className="flex items-center gap-3">
          {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm max-w-[180px] truncate text-[var(--text-primary)]">{val}</p>
            <p className="text-xs text-[var(--text-muted)]">v{item.version || '1.0'}</p>
          </div>
        </div>
      )
    },
    { key: 'package_name', label: 'Package Name', render: (val) => <span className="text-xs text-[var(--text-muted)] font-mono">{val || '—'}</span> },
    { key: 'category', label: 'Category', render: (val) => <span className="text-xs">{val}</span> },
    {
      key: 'file_url',
      label: 'APK Link',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline max-w-[120px] truncate text-xs">
          Download <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      ) : '—'
    },
    { key: 'downloads', label: 'DLs', render: (val) => <span className="text-xs text-[var(--text-muted)]">{val || 0}</span> }
  ]

  const fields = [
    { key: 'title', label: 'App Title', required: true },
    { key: 'package_name', label: 'Package Name (e.g. com.example.app)' },
    { key: 'version', label: 'Version (e.g. 1.0.0)', required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['Games', 'Productivity', 'Social', 'Tools', 'Media'], required: true },
    { key: 'file_url', label: 'APK File URL', type: 'url', required: true },
    { key: 'thumbnail_url', label: 'Icon URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea', fullWidth: true }
  ]

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Android Apps</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage Android app listings and download links.</p>
      </div>

      <div className="flex-1 min-h-0">
        <CrudTable
          items={items} loading={loading} totalCount={totalCount} columns={columns}
          page={page} setPage={setPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onAddNew={() => { setEditingItem(null); setIsModalOpen(true) }}
          onEdit={(item) => { setEditingItem(item); setIsModalOpen(true) }}
          onDelete={handleDelete} onToggleFeatured={toggleFeatured} onToggleStatus={toggleStatus}
          addButtonText="Add App"
        />
      </div>

      <CrudModal isOpen={isModalOpen} onClose={onClose} title="Android App" initialData={editingItem} fields={fields} onSave={handleSave} />
    </div>
  )
}

export default AdminApksPage
