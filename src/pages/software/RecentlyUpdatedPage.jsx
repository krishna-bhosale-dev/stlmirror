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

          {/* Editorial intro */}
          <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-3">Why Recent Updates Matter</h2>
            <p className="text-gray-300 mb-3">
              Software that stops receiving updates is software that stops getting security patches, compatibility fixes, and feature improvements. This page tracks tools in our directory that have received meaningful updates — not just minor version number bumps, but substantive changes that affect how you use the software.
            </p>
            <p className="text-gray-300 mb-3">
              When a tool on this list receives an update, we review the changelog and update our review accordingly. If a major version introduces breaking changes, pricing model shifts, or significant feature additions, we note those in the relevant tool page. Our goal is to keep every review current, not just accurate at time of writing.
            </p>
            <p className="text-gray-300">
              Tools sorted here by most recent <code className="text-blue-300 text-sm bg-white/10 px-1 rounded">lastUpdated</code> date in our database. For context on any specific tool's update history, visit its individual review page. View the <a href="/software" className="text-blue-400 underline">full directory</a> for all categories.
            </p>
          </div>

          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default RecentlyUpdatedPage
