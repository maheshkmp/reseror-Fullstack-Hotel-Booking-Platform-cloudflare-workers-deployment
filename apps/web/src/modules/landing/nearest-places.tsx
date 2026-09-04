"use client";

import { useRouter } from "next/navigation";
import { useGetDestinations } from "../../features/admin/destination-management/actions/get-action";
import { ArrowRight } from "lucide-react";

const DUMMY_NEARBY = [
  {
    title: "Sigiriya Rock Fortress",
    content: "Ancient palace atop a dramatic 200m rock — a UNESCO World Heritage Site.",
    featuredImage: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&h=400&fit=crop",
    category: "Nearby Places",
  },
  {
    title: "Yala National Park",
    content: "Sri Lanka's most popular wildlife sanctuary with leopards and elephants.",
    featuredImage: "https://images.unsplash.com/photo-1705936981588-a4192f66fcfb?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&h=400&fit=crop",
    category: "Nearby Places",
  },
  {
    title: "Mirissa Beach",
    content: "Pristine crescent-shaped beach perfect for whale watching and surfing.",
    featuredImage: "https://images.unsplash.com/photo-1673999298320-b668829e5679?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&h=400&fit=crop",
    category: "Nearby Places",
  },
  {
    title: "Dambulla Cave Temple",
    content: "The largest and best-preserved cave temple complex in Sri Lanka.",
    featuredImage: "https://images.unsplash.com/photo-1704797390869-a78dee660597?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&h=400&fit=crop",
    category: "Nearby Places",
  },
  {
    title: "Nuwara Eliya",
    content: "Known as 'Little England', famous for tea estates and cool climate.",
    featuredImage: "https://images.unsplash.com/photo-1619974643633-12acfdcedd16?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&h=400&fit=crop",
    category: "Nearby Places",
  },
  {
    title: "Trincomalee",
    content: "Crystal-clear waters with pristine beaches and ancient temples.",
    featuredImage: "https://images.unsplash.com/photo-1720945490863-3b29042ba584?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&h=400&fit=crop",
    category: "Nearby Places",
  },
];

export function NearestPlaces() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetDestinations({
    page: 1,
    limit: 20,
    search: "",
    sort: "desc",
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-3 w-56" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-80 mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const allData = !isError && data?.data?.length > 0 ? data.data : DUMMY_NEARBY;
  const nearbyPlaces = allData.filter((i: any) => i.category === "Nearby Places");
  const displayPlaces = nearbyPlaces.length > 0 ? nearbyPlaces : DUMMY_NEARBY;

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="inline-block text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">
              Nearby Attractions
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#1E3A5F]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Explore Nearby Places
            </h2>
            <p className="text-gray-500 mt-2">
              Amazing attractions and landmarks within reach
            </p>
          </div>
          <button
            onClick={() => router.push("/search")}
            className="text-sm font-medium text-[#1E3A5F] hover:text-amber-500 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPlaces.slice(0, 6).map((place: any, index: number) => (
            <div
              key={index}
              onClick={() => router.push(place.externalLink || "/search")}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={place.featuredImage || "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&h=400&fit=crop"}
                  alt={place.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg">{place.title}</h3>
                <p className="text-white/75 text-sm mt-1 line-clamp-2">{place.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/search")}
            className="border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Show all places
          </button>
        </div>
      </div>
    </section>
  );
}
