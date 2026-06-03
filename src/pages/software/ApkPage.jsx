import { Smartphone } from 'lucide-react'
import { getSoftwareByCategory } from '../../data/softwareData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import PageHero from '../../components/common/PageHero'
import { SoftwareGrid } from '../../components/software/SoftwareGrid'

const ApkPage = () => {
  const software = getSoftwareByCategory('APK')
  return (
    <>
      <SEOHead
        title="Android APK Downloads — Emulators & Apps"
        description="Download the best Android apps and emulators. Curated APK guides with installation tutorials, system requirements, and expert reviews."
        canonical="/apk"
      />
      <div className="min-h-screen bg-grid">
        <PageHero
          icon={Smartphone}
          badge="Android APKs"
          title="Android Apps"
          titleGradient="& Emulators"
          description={`${software.length} Android emulators and apps with installation guides, performance reviews, and system requirements.`}
          compact
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Software', href: '/software' }, { label: 'Android APKs' }]} />
          </div>
          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default ApkPage
