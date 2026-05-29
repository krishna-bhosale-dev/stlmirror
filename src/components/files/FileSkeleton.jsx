const FileSkeleton = () => (
  <div className="card overflow-hidden">
    {/* Thumbnail */}
    <div className="h-48 shimmer" />
    <div className="p-4 space-y-3">
      {/* Extension badge + date */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-14 rounded-md shimmer" />
        <div className="h-4 w-20 rounded-md shimmer" />
      </div>
      {/* Title */}
      <div className="h-5 w-full rounded shimmer" />
      <div className="h-5 w-3/4 rounded shimmer" />
      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-16 rounded shimmer" />
        <div className="h-8 w-24 rounded-lg shimmer" />
      </div>
    </div>
  </div>
)

export const FileSkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <FileSkeleton key={i} />
    ))}
  </div>
)

export default FileSkeleton
