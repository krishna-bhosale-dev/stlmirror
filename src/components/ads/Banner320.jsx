import { useEffect, useRef } from 'react'
import './ads.css'

const INVOKE_SRC =
  'https://www.highperformanceformat.com/e17bc6d33c8c5e7ee7cb07d922823b62/invoke.js'

const AT_OPTIONS = {
  key: 'e17bc6d33c8c5e7ee7cb07d922823b62',
  format: 'iframe',
  height: 50,
  width: 320,
  params: {},
}

/**
 * Banner320 — Adsterra 320×50 Mobile Banner.
 * Displayed only on screens < 768px (via CSS).
 * Rendered as a fixed sticky bar at the bottom of the viewport.
 *
 * Mount this once globally in App.jsx to cover all pages.
 */
const Banner320 = () => {
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
      className="ad-wrapper ad-mobile-only ad-banner-320"
      aria-label="Advertisement"
      ref={containerRef}
    />
  )
}

export default Banner320
