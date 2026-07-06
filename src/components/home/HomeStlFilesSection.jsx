import { Files } from 'lucide-react'
import HomeSectionHeader from './HomeSectionHeader'
import FileCard from '../files/FileCard'
import { FileSkeletonGrid } from '../files/FileSkeleton'

const HomeStlFilesSection = ({ files = [], loading = false }) => {
  const displayFiles = files.slice(0, 4) // Show latest 4

  return (
    <section className="mb-16">
      <HomeSectionHeader 
        icon={Files} 
        title="Latest STL Files" 
        linkTo="/stl-files" 
        colorClass="text-orange-400"
        bgClass="bg-orange-500/10 border-orange-500/20"
      />

      {loading ? (
        <FileSkeletonGrid count={4} />
      ) : displayFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayFiles.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--text-muted)] text-sm">No files uploaded yet.</p>
      )}
    </section>
  )
}

export default HomeStlFilesSection
