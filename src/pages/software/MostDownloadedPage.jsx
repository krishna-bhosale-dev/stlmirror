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

          {/* Editorial intro */}
          <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-3">How We Determine "Most Downloaded"</h2>
            <p className="text-gray-300 mb-3">
              This list ranks software by the download volume and user adoption data we observe across the tools in our directory. High download counts alone do not earn a spot — each tool is still independently reviewed to confirm that the popularity is warranted and that the tool delivers real value to users.
            </p>
            <p className="text-gray-300 mb-3">
              Tools that appear here have been tested for: installation reliability across Windows and Mac, quality of documentation, active developer support, and a pricing model that is fair for the value delivered. We do not list software with dark patterns, forced registration walls, or hidden costs in this section.
            </p>
            <p className="text-gray-300">
              If you find a tool that no longer meets this quality bar, use our feedback option to report it. Our goal is to keep this list trustworthy, not just popular. Browse the <a href="/software" className="text-blue-400 underline">full directory</a> for the complete catalog.
            </p>
          </div>

          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default MostDownloadedPage
