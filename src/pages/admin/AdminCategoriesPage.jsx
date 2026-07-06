import { Tags } from 'lucide-react'

const AdminCategoriesPage = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Categories (Reference)</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          A global view of categories used across different content types. Categories are currently loosely enforced strings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Tags className="w-4 h-4 text-orange-400" /> STL Files
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>Images</li>
            <li>Documents</li>
            <li>Videos</li>
            <li>Archives</li>
            <li>Apps</li>
            <li>Audio</li>
            <li>Other</li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Tags className="w-4 h-4 text-purple-400" /> AI Tools
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>AI Writing</li>
            <li>AI Research</li>
            <li>AI Coding</li>
            <li>AI Video</li>
            <li>AI Image Generation</li>
            <li>AI Voice</li>
            <li>AI Productivity</li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Tags className="w-4 h-4 text-blue-400" /> Premium Downloads
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>Themes</li>
            <li>Templates</li>
            <li>Graphics</li>
            <li>UI Kits</li>
            <li>Plugins</li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Tags className="w-4 h-4 text-green-400" /> Website Links
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>Design</li>
            <li>Development</li>
            <li>Marketing</li>
            <li>Productivity</li>
            <li>Other</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminCategoriesPage
