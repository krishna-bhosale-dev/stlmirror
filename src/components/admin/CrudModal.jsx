import { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Reusable modal for creating/editing records.
 * `fields` array format: { key, label, type (text|textarea|select|url), options (if select), required }
 */
const CrudModal = ({
  isOpen,
  onClose,
  title,
  initialData, // null for create, object for edit
  fields,
  onSave, // async function(data) => { success: boolean, error?: string }
}) => {
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData)
      } else {
        // Initialize empty strings for all fields
        const emptyData = {}
        fields.forEach(f => {
          emptyData[f.key] = f.type === 'select' && f.options?.length > 0 ? f.options[0] : ''
        })
        setFormData(emptyData)
      }
      setError(null)
    }
  }, [isOpen, initialData, fields])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    
    try {
      const result = await onSave(formData)
      if (result.success) {
        onClose()
      } else {
        setError(result.error || 'Failed to save')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={!isSaving ? onClose : undefined}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border-glass)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-glass)] bg-[var(--bg-secondary)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {initialData ? 'Edit' : 'Create'} {title}
            </h2>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 rounded-xl hover:bg-[var(--bg-primary)] transition-colors text-[var(--text-secondary)] hover:text-red-400 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map(field => {
                const isFullWidth = field.type === 'textarea' || field.fullWidth

                return (
                  <div key={field.key} className={`space-y-1 ${isFullWidth ? 'md:col-span-2' : ''}`}>
                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                        rows={field.rows || 4}
                        className="input-base w-full p-3 text-sm resize-y"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                        className="input-base w-full p-3 text-sm"
                      >
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                        className="input-base w-full p-3 text-sm"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-glass)] bg-[var(--bg-secondary)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              onClick={handleSubmit}
              className="btn-primary flex items-center gap-2 px-6 py-2 text-sm"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-white/20 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CrudModal
