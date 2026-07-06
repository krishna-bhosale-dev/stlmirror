import { useEffect } from 'react'

// Module-level flag — ensures the script is only ever injected once
// across all React re-renders, StrictMode double-invocations, and
// route changes.
let socialBarLoaded = false

const SOCIAL_BAR_SRC =
  'https://pl30227600.effectivecpmnetwork.com/6b/97/0c/6b970ce00f6fa038191acfcb7bc084f0.js'

const SocialBar = () => {
  useEffect(() => {
    if (socialBarLoaded) return
    if (document.querySelector(`script[src="${SOCIAL_BAR_SRC}"]`)) {
      socialBarLoaded = true
      return
    }

    const script = document.createElement('script')
    script.src = SOCIAL_BAR_SRC
    script.async = true
    document.body.appendChild(script)
    socialBarLoaded = true

    // Social Bar injects itself into the DOM — no cleanup needed.
    // We intentionally do NOT remove the script on unmount because this
    // component is mounted once for the entire app lifetime.
  }, [])

  // Renders nothing — the Social Bar widget manages its own DOM.
  return null
}

export default SocialBar
