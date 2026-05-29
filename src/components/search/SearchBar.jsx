import { useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SearchBar = ({ value, onChange, placeholder = 'Search files…', className = '' }) => {
  const inputRef = useRef(null)

  return (
    <div className={`relative group ${className}`}>
      {/* Glow border on focus */}
      <div className="absolute -inset-[1px] rounded-[13px] bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-[0.5px]" />

      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors duration-200 pointer-events-none z-10" />

        <input
          ref={inputRef}
          id="file-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-base w-full pl-12 pr-12 py-3.5 text-sm rounded-xl relative z-[1]"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                onChange('')
                inputRef.current?.focus()
              }}
              className="absolute right-4 z-10 p-0.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SearchBar
