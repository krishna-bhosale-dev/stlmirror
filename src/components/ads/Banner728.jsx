import { useEffect, useRef } from 'react'
import './ads.css'

const INVOKE_SRC =
  'https://www.highperformanceformat.com/4bcacba7ba1bd19a43e996d950c8a59a/invoke.js'

const AT_OPTIONS = {
  key: '4bcacba7ba1bd19a43e996d950c8a59a',
  format: 'iframe',
  height: 90,
  width: 728,
  params: {},
}

/**
 * Banner728 — Adsterra 728×90 Leaderboard banner.
 * Desktop only (hidden on screens < 768px via CSS).
 *
 * The invoke script scans the DOM for the nearest ad container and injects
 * an iframe into it. We append the script AFTER the container div is mounted,
 * using a ref to ensure the container exists in the DOM first.
 */
const Banner728 = () => {
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

    // Append script immediately after the container so Adsterra can find it
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
      className="ad-wrapper ad-desktop-only ad-banner-728"
      aria-label="Advertisement"
      ref={containerRef}
    />
  )
}

export default Banner728
