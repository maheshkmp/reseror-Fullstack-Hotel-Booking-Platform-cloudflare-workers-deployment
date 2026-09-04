export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Skeleton */}
      <section className="relative w-full h-[60vh] bg-[#003580] flex flex-col items-center justify-center overflow-hidden animate-pulse">
        <div className="w-full max-w-4xl mx-auto px-6 text-center">
          <div className="h-10 bg-white/20 rounded-lg w-2/3 mx-auto mb-4" />
          <div className="h-4 bg-white/10 rounded-lg w-1/2 mx-auto mb-10" />
          <div className="w-full max-w-2xl h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl mx-auto" />
        </div>
      </section>

      {/* Categories Skeleton */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 py-3">
        <div className="max-w-5xl mx-auto px-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-100 rounded-full flex-shrink-0 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Featured Section Skeleton */}
      <div className="py-14 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-10 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
