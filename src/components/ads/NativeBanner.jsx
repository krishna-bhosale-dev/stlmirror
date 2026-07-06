import { useEffect, useRef, useId } from 'react'
import './ads.css'

const NATIVE_SCRIPT_SRC =
  'https://pl30227599.effectivecpmnetwork.com/66a85f0db52d35305fbec6ef2a794c7e/invoke.js'

/**
 * NativeBanner — Adsterra Native / Smart Banner unit.
 *
 * Uses React's useId() to generate a unique container id per instance,
 * preventing conflicts when multiple NativeBanner components are on the
 * same page (e.g. FileDetailPage + AiToolDetailPage both use it).
 *
 * The invoke.js is appended directly inside the container div so that
 * Adsterra's script correctly targets the sibling container element.
 */
const NativeBanner = () => {
  const uid = useId().replace(/:/g, '-')
  const containerId = `container-66a85f0db52d35305fbec6ef2a794c7e${uid}`
  const containerRef = useRef(null)
  const scriptRef = useRef(null)
  const injectedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate injection on StrictMode double-invocation
    if (injectedRef.current) return
    injectedRef.current = true

    const script = document.createElement('script')
    script.src = NATIVE_SCRIPT_SRC
    script.async = true
    script.setAttribute('data-cfasync', 'false')

    // Append after the container div so the script can find it
    if (containerRef.current?.parentNode) {
      containerRef.current.parentNode.appendChild(script)
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
    <div className="ad-wrapper ad-native-banner" aria-label="Advertisement">
      <div id={containerId} ref={containerRef} />
    </div>
  )
}

export default NativeBanner
