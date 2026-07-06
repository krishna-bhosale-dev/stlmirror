import { useEffect, useRef } from 'react'
import './ads.css'

const INVOKE_SRC =
  'https://www.highperformanceformat.com/6c4489aa429296a3c82d87c55d6bde25/invoke.js'

const AT_OPTIONS = {
  key: '6c4489aa429296a3c82d87c55d6bde25',
  format: 'iframe',
  height: 250,
  width: 300,
  params: {},
}

/**
 * Banner300 — Adsterra 300×250 Medium Rectangle banner.
 * Visible on all screen sizes.
 *
 * Each instance owns its script lifecycle independently using a ref-based
 * injection flag. The script is appended inside the container div so that
 * Adsterra's invoke.js targets the correct adjacent element.
 */
const Banner300 = () => {
  const containerRef = useRef(null)
  const scriptRef = useRef(null)
  const injectedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate injection on StrictMode double-invocation
    if (injectedRef.current) return
    injectedRef.current = true

    // Set atOptions synchronously before injecting the script
    window.atOptions = AT_OPTIONS

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = INVOKE_SRC
    script.async = true

    // Append script inside the container so Adsterra targets it correctly
    if (containerRef.current) {
      containerRef.current.appendChild(script)
    } else {
      document.body.appendChild(script)
    }
    scriptRef.current = script

    return () => {
      injectedRef.current = false
      if (scriptRef.current) {
        try { scriptRef.current.parentNode?.removeChild(scriptRef.current) } catch (_) {}
        scriptRef.current = null
      }
    }
  }, [])

  return (
    <div
      className="ad-wrapper ad-banner-300"
      aria-label="Advertisement"
      ref={containerRef}
    />
  )
}

export default Banner300
