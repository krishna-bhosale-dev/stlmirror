import { useEffect } from 'react'

/**
 * SEOHead — injects dynamic meta tags + structured data into <head>
 * Usage: <SEOHead title="..." description="..." canonical="/about" />
 */
const SEOHead = ({
  title = 'STL Mirror — Software & Resource Hub',
  description = 'STL Mirror is your go-to platform for software downloads, APK files, developer tools, and expert guides on the latest tech.',
  canonical = '',
  ogImage = 'https://www.stlmirror.in/og-image.png',
  ogType = 'website',
  structuredData = null,
  noindex = false,
}) => {
  const baseUrl = 'https://www.stlmirror.in'
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl
  const fullTitle = title.includes('STL Mirror') ? title : `${title} | STL Mirror`

  useEffect(() => {
    // Title
    document.title = fullTitle

    // Helper to set/create a meta tag
    const setMeta = (selector, value, attr = 'content') => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const parts = selector.match(/\[(.+?)="(.+?)"\]/)
        if (parts) el.setAttribute(parts[1], parts[2])
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    // Helper to set/create a link tag
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    // Basic
    setMeta('meta[name="description"]', description)
    setMeta('meta[name="robots"]', noindex ? 'noindex, nofollow' : 'index, follow')

    // Canonical
    setLink('canonical', fullCanonical)

    // Open Graph
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', fullCanonical)
    setMeta('meta[property="og:type"]', ogType)
    setMeta('meta[property="og:image"]', ogImage)

    // Twitter
    setMeta('meta[name="twitter:title"]', fullTitle)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('meta[name="twitter:url"]', fullCanonical)
    setMeta('meta[name="twitter:image"]', ogImage)

    // Structured data
    let sdEl = document.querySelector('#ld-json-dynamic')
    if (structuredData) {
      if (!sdEl) {
        sdEl = document.createElement('script')
        sdEl.id = 'ld-json-dynamic'
        sdEl.type = 'application/ld+json'
        document.head.appendChild(sdEl)
      }
      
      // If structuredData is an array, we render an array of schemas
      if (Array.isArray(structuredData)) {
        sdEl.textContent = JSON.stringify(structuredData)
      } else {
        sdEl.textContent = JSON.stringify(structuredData)
      }
    } else if (sdEl) {
      sdEl.remove()
    }

    return () => {
      // Reset to defaults on unmount
      document.title = 'STL Mirror — Software & Resource Hub'
    }
  }, [fullTitle, description, fullCanonical, ogImage, ogType, structuredData, noindex])

  return null
}

export default SEOHead
