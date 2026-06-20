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

          {/* Editorial Intro */}
          <div className="mt-12 max-w-3xl">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Essential Tools for Developers</h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>A developer's productivity is heavily influenced by their tooling. While the landscape of development software is vast, certain tools have become undisputed industry standards due to their performance, extensibility, and massive community support.</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Core Editor:</strong> <strong>Visual Studio Code</strong> is the de facto standard for almost all modern web and general-purpose development. It is free, open-source, and its extension ecosystem allows it to function as a full IDE for virtually any language. We strongly recommend it as the starting point for any new developer.</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Supporting Utilities:</strong> Beyond the editor, a developer needs reliable supporting software. For file compression and extraction (frequently needed when downloading libraries or project archives), <strong>7-Zip</strong> is the undisputed king — it's lightweight, open-source, and free from adware. For recording screen demonstrations, bug reports, or tutorials, <strong>OBS Studio</strong> provides professional-grade capabilities without watermarks or subscription fees.</p>
              <p>Every tool we recommend in this category is free, widely adopted by professionals, and secure to install. We test these tools continuously to ensure they remain the best options in their respective categories.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default DevToolsPage
