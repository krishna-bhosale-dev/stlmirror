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

          {/* Editorial intro */}
          <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-3">How We Select and Review New Software</h2>
            <p className="text-gray-300 mb-3">
              Every tool added to this list has been independently evaluated by Krishna Bhosale before publication. New entries are added when a tool meets our baseline criteria: stable release version, a clearly defined use case, a working free tier or trial period, and documentation sufficient to evaluate it fairly.
            </p>
            <p className="text-gray-300 mb-3">
              Each listing includes our hands-on assessment of the tool's core features, pricing structure, and the specific user types it serves best. We prioritize software that offers genuine value to developers, students, and productivity-focused users — not tools we have only read about.
            </p>
            <p className="text-gray-300">
              This page is updated as new software is reviewed and published. If you are looking for a specific tool that is not yet listed, check back regularly or browse our <a href="/software" className="text-blue-400 underline">full software directory</a>.
            </p>
          </div>

          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default LatestSoftwarePage
