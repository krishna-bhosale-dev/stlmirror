import { FileText } from 'lucide-react'
import { getSoftwareByCategory } from '../../data/softwareData'
import SEOHead from '../../components/seo/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import PageHero from '../../components/common/PageHero'
import { SoftwareGrid } from '../../components/software/SoftwareGrid'

const PdfToolsPage = () => {
  const software = getSoftwareByCategory('PDF Tools')
  return (
    <>
      <SEOHead
        title="Best PDF Tools — Readers, Editors & Converters"
        description="Find the best free and paid PDF tools for Windows, Mac, and Android. Compare PDF readers, editors, converters, and annotators with expert reviews."
        canonical="/pdf-tools"
      />
      <div className="min-h-screen bg-grid">
        <PageHero
          icon={FileText}
          badge="PDF Tools"
          title="PDF Readers"
          titleGradient="& Editors"
          description={`${software.length} PDF tools reviewed and ranked — from lightweight readers to full-featured editors and converters.`}
          compact
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Software', href: '/software' }, { label: 'PDF Tools' }]} />
          </div>
          <SoftwareGrid software={software} />
        </div>
      </div>
    </>
  )
}
export default PdfToolsPage
