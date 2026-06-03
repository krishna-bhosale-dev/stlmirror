import { TrendingUp } from 'lucide-react'
import { getMostDownloaded } from '../../data/softwareData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import PageHero from '../../components/common/PageHero'
import { SoftwareGrid } from '../../components/software/SoftwareGrid'

const MostDownloadedPage = () => {
  const software = getMostDownloaded()
  return (
    <>
      <SEOHead
        title="Most Downloaded Software — Top Picks on STL Mirror"
        description="The most downloaded software on STL Mirror. Discover the most popular apps and tools trusted by millions of users worldwide."
        canonical="/most-downloaded"
      />
      <div className="min-h-screen bg-grid">
        <PageHero
          icon={TrendingUp}
          badge="Most Popular"
          title="Most"
          titleGradient="Downloaded"
          description="The most popular software in our directory, ranked by total download count."
          compact
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Software', href: '/software' }, { label: 'Most Downloaded' }]} />
          </div>
          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default MostDownloadedPage
