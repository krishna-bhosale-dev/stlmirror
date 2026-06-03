// Category to Unsplash image mapping for fallback thumbnails
const fallbackMap = {
  'Development': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop',
  'Android': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80&auto=format&fit=crop',
  '3D Printing': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80&auto=format&fit=crop',
  'Tools': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop',
  'PDF Tools': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80&auto=format&fit=crop',
  'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop',
  'Security': 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80&auto=format&fit=crop',
  'Productivity': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
  'Tutorials': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop'
}

export const getFallbackImage = (category) => {
  return fallbackMap[category] || fallbackMap['default']
}

export const handleImageError = (e, category) => {
  const fallback = getFallbackImage(category)
  if (e.target.src !== fallback) {
    e.target.src = fallback
  }
}
