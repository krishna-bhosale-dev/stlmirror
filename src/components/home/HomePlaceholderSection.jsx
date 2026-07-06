import HomeSectionHeader from './HomeSectionHeader'

const HomePlaceholderSection = ({ items = [], title, icon, linkTo, colorClass, bgClass, renderItem }) => {
  // If there are no items, hide the section entirely
  if (!items || items.length === 0) return null

  const displayItems = items.slice(0, 4)

  return (
    <section className="mb-16">
      <HomeSectionHeader 
        icon={icon} 
        title={title} 
        linkTo={linkTo} 
        colorClass={colorClass}
        bgClass={bgClass}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayItems.map(renderItem)}
      </div>
    </section>
  )
}

export default HomePlaceholderSection
