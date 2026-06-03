import { RefreshCw } from 'lucide-react'
import { getLatestSoftware } from '../../data/softwareData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import PageHero from '../../components/common/PageHero'
import { SoftwareGrid } from '../../components/software/SoftwareGrid'

const RecentlyUpdatedPage = () => {
  const software = getLatestSoftware() // same sort: by lastUpdated
  return (
    <>
      <SEOHead
        title="Recently Updated Software — Fresh Versions on STL Mirror"
        description="Browse recently updated software with the latest versions, new features, and bug fixes. Stay up to date with the freshest tools."
        canonical="/recently-updated"
      />
      <div className="min-h-screen bg-grid">
        <PageHero
          icon={RefreshCw}
          badge="Fresh Updates"
          title="Recently"
          titleGradient="Updated"
          description="Software with the most recent version updates — sorted by last updated date so you never miss a new release."
          compact
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Software', href: '/software' }, { label: 'Recently Updated' }]} />
          </div>
          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default RecentlyUpdatedPage
