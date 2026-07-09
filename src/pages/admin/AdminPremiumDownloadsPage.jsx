import { useState } from 'react'
import { Download, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCrud } from '../../hooks/useCrud'
import CrudTable from '../../components/admin/CrudTable'
import CrudModal from '../../components/admin/CrudModal'

const AdminPremiumDownloadsPage = () => {
  const {
    items,
    loading,
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
    toggleStatus
  } = useCrud('premium_downloads')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleSave = async (data) => {
    let res
    if (editingItem) {
      res = await update(editingItem.id, data)
    } else {
      res = await create(data)
    }

    if (res.success) {
      toast.success(editingItem ? 'Updated successfully!' : 'Created successfully!')
    }
    return res
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const res = await remove(id)
      if (res.success) toast.success('Deleted successfully')
      else toast.error(res.error || 'Delete failed')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (val, item) => (
        <div className="flex items-center gap-3">
          {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-[var(--bg-secondary)]" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
              <Download className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm max-w-[200px] truncate text-[var(--text-primary)]">{val}</p>
            <p className="text-xs text-[var(--text-muted)]">{item.category}</p>
          </div>
        </div>
      )
    },
    {
      key: 'file_url',
      label: 'Download Link',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
          Link <ExternalLink className="w-3 h-3" />
        </a>
      ) : '—'
    },
    {
      key: 'downloads',
      label: 'Downloads',
      render: (val) => <span className="text-[var(--text-muted)]">{val || 0}</span>
    }
  ]

  const fields = [
    { key: 'title', label: 'Title', required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['Themes', 'Templates', 'Graphics', 'UI Kits', 'Plugins'], required: true },
    { key: 'file_url', label: 'File URL (Direct Download)', type: 'url', required: true },
    { key: 'thumbnail_url', label: 'Thumbnail URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea', fullWidth: true }
  ]

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Free Resources</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage free digital assets and downloadable resources.</p>
      </div>

      <div className="flex-1 min-h-0">
        <CrudTable
          items={items}
          loading={loading}
          totalCount={totalCount}
          columns={columns}
          page={page}
          setPage={setPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onAddNew={() => { setEditingItem(null); setIsModalOpen(true) }}
          onEdit={(item) => { setEditingItem(item); setIsModalOpen(true) }}
          onDelete={handleDelete}
          onToggleFeatured={toggleFeatured}
          onToggleStatus={toggleStatus}
          addButtonText="Add Premium Item"
        />
      </div>

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Free Resource"
        initialData={editingItem}
        fields={fields}
        onSave={handleSave}
      />
    </div>
  )
}

export default AdminPremiumDownloadsPage
