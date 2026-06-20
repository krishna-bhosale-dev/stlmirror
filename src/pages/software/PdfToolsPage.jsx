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

          {/* Editorial Intro */}
          <div className="mt-12 max-w-3xl">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Choosing the Right PDF Tool</h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>The PDF ecosystem is notoriously confusing. Many free PDF readers are bundled with adware, while professional PDF editors often cost upwards of $150 per year. For most users — students, developers, and small business owners — a combination of high-quality free tools is significantly better than a bloated premium suite.</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Our testing methodology:</strong> We evaluate PDF tools based on four criteria: cold-start opening speed, memory footprint during large document rendering, accuracy of text selection/annotation, and the presence of hidden paywalls or adware.</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Which tool do you actually need?</strong> If you strictly need to <em>read</em> PDFs (like textbooks or research papers), <strong>SumatraPDF</strong> is the undisputed best choice on Windows — it opens instantly and uses negligible RAM. If you need to annotate, highlight, or fill forms, <strong>Foxit PDF Reader</strong> provides those features for free. If you need to merge, split, or convert PDFs occasionally, we recommend using reputable web-based tools like ILovePDF rather than installing heavy desktop conversion software.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default PdfToolsPage
