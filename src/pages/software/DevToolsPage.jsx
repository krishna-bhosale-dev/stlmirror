import { Code } from 'lucide-react'
import { getSoftwareByCategory } from '../../data/softwareData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import PageHero from '../../components/common/PageHero'
import { SoftwareGrid } from '../../components/software/SoftwareGrid'

const DevToolsPage = () => {
  const software = getSoftwareByCategory('Developer Tools')
  return (
    <>
      <SEOHead
        title="Best Developer Tools — IDEs, Editors & Utilities"
        description="Discover the best developer tools for coding, debugging, screen recording, and productivity. Expert reviews with installation guides."
        canonical="/developer-tools"
      />
      <div className="min-h-screen bg-grid">
        <PageHero
          icon={Code}
          badge="Developer Tools"
          title="Tools for"
          titleGradient="Developers"
          description={`${software.length} developer tools including code editors, screen recorders, archivers, and productivity utilities — all reviewed by our tech team.`}
          compact
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Software', href: '/software' }, { label: 'Developer Tools' }]} />
          </div>
          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default DevToolsPage
