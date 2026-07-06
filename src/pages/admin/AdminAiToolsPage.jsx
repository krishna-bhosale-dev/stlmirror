import { useState } from 'react'
import { Bot, Search, ExternalLink } from 'lucide-react'
import { aiToolsList } from '../../data/aiToolsData'

const AdminAiToolsPage = () => {
  const [search, setSearch] = useState('')

  const filtered = aiToolsList.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">AI Tools (Read-Only)</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          AI Tools are currently managed via static data files. To add or edit an AI tool, you must modify <code className="bg-[var(--bg-secondary)] px-1 py-0.5 rounded text-[var(--accent-primary)]">src/data/aiToolsData.js</code> and deploy the code.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search AI Tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base w-full pl-9 pr-4 py-2 text-sm"
            />
          </div>
          <span className="text-sm text-[var(--text-muted)]">{filtered.length} tools</span>
        </div>

        <div className="glass rounded-xl overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-glass)] text-[var(--text-muted)] sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Tool Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Pricing</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-glass)] text-[var(--text-secondary)]">
                {filtered.map(tool => (
                  <tr key={tool.id} className="hover:bg-[var(--bg-secondary)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {tool.thumbnail ? (
                           <img src={tool.thumbnail} alt="" className="w-8 h-8 rounded bg-white object-contain p-1" />
                        ) : (
                           <div className="w-8 h-8 rounded bg-[var(--bg-secondary)] flex items-center justify-center"><Bot className="w-4 h-4"/></div>
                        )}
                        <span className="font-semibold text-[var(--text-primary)]">{tool.title.replace(' Review', '')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{tool.category}</td>
                    <td className="px-4 py-3 text-xs">{tool.pricing}</td>
                    <td className="px-4 py-3 text-xs">{tool.date}</td>
                    <td className="px-4 py-3 text-right">
                      <a href={`/ai-tools/${tool.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex p-1.5 hover:bg-blue-500/10 text-blue-400 rounded-lg">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAiToolsPage
