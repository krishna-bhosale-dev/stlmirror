import { Clock } from 'lucide-react'
import { getLatestSoftware } from '../../data/softwareData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import PageHero from '../../components/common/PageHero'
import { SoftwareGrid } from '../../components/software/SoftwareGrid'

const LatestSoftwarePage = () => {
  const software = getLatestSoftware()
  return (
    <>
      <SEOHead
        title="Latest Software — Newest Additions to STL Mirror"
        description="Browse the latest software additions to STL Mirror. Discover newly reviewed apps, tools, and utilities with fresh installation guides."
        canonical="/latest"
      />
      <div className="min-h-screen bg-grid">
        <PageHero
          icon={Clock}
          badge="Latest Additions"
          title="Newest"
          titleGradient="Software"
          description="The most recently added and reviewed software in our directory, sorted by update date."
          compact
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Software', href: '/software' }, { label: 'Latest Software' }]} />
          </div>
          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default LatestSoftwarePage
