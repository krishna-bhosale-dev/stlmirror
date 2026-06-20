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

          {/* Editorial Intro */}
          <div className="mt-12 max-w-3xl">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>About Android Emulators for PC</h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>Android emulators let you run the full Android operating system on a Windows or Mac computer, giving you access to millions of apps and games from the Google Play Store without needing a physical Android device. They work by creating a virtualized Android environment using your computer's hardware — specifically CPU virtualization features (Intel VT-x or AMD-V) — to achieve near-native performance.</p>
              <p>The most common use cases are PC gaming (running mobile titles like Free Fire, BGMI, and Mobile Legends with keyboard, mouse, and controller controls), app development testing (checking your Android app on a virtual device without physical hardware), and running mobile-only apps on a desktop environment.</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Which emulator should you choose?</strong> BlueStacks 5 is the best overall choice for gaming with the most features and support community. LDPlayer 9 is the best completely free option with no ads. NoxPlayer is the top choice for users who need root access. MEmu Play is the only practical option for computers with 2 GB RAM.</p>
              <p>All emulators listed here are safe when downloaded from their official websites. Never download emulator installers from third-party sites — they frequently bundle adware or malware alongside the emulator. Each entry links directly to the official developer's download page.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ApkPage
