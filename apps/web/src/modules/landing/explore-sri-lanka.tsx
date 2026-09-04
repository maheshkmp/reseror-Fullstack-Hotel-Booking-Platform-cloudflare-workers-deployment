"use client";

import { useRouter } from "next/navigation";
import { useGetDestinations } from "../../features/admin/destination-management/actions/get-action";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const DUMMY_DESTINATIONS = [
  {
    title: "Colombo",
    content: "The vibrant capital where colonial charm meets a modern skyline.",
    featuredImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80",
    category: "Popular Destinations",
    count: "450+ Stays",
  },
  {
    title: "Kandy",
    content: "The sacred hill capital, home to tea estates and mist-covered mountains.",
    featuredImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    category: "Popular Destinations",
    count: "320+ Stays",
  },
  {
    title: "Ella",
    content: "A hiker's paradise with breathtaking views and the Nine-Arch Bridge.",
    featuredImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    category: "Popular Destinations",
    count: "190+ Stays",
  },
  {
    title: "Galle",
    content: "Historic Dutch Fort city with cobblestone streets, lighthouse, and boutique shops.",
    featuredImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80",
    category: "Popular Destinations",
    count: "280+ Stays",
  },
  { 
    title: "Hill Country", 
    content: "Tea plantations and cool climates.", 
    featuredImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80", 
    category: "Region",
    count: "850+ Properties"
  },
  { 
    title: "Cultural Triangle", 
    content: "Ancient ruins and sacred temples.", 
    featuredImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", 
    category: "Region",
    count: "600+ Properties"
  },
  { 
    title: "East Coast", 
    content: "Surfing paradises and hidden bays.", 
    featuredImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", 
    category: "Region",
    count: "400+ Properties"
  },
  { 
    title: "South Coast", 
    content: "Golden beaches and whale watching.", 
    featuredImage: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80", 
    category: "Region",
    count: "750+ Properties"
  },
];

export function ExploreSriLanka() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetDestinations({
    page: 1,
    limit: 20,
    search: "",
    sort: "desc",
  });

  const allData = !isError && data?.data?.length > 0 ? data.data : DUMMY_DESTINATIONS;
  const popular = allData.filter((i: any) => i.category === "Popular Destinations").slice(0, 4);
  const regions = allData.filter((i: any) => i.category === "Region").slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-3" />
          <div className="h-10 w-64 bg-gray-100 rounded animate-pulse mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-50 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className=" bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">
                The Pearl of the Indian Ocean
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-[#1E3A5F] leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Explore Sri Lanka
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base leading-relaxed">
              From mist-covered mountains and emerald tea estates to pristine golden beaches 
              and ancient kingdoms — discover the magic of our island home.
            </p>
          </div>
          <button
            onClick={() => router.push("/search")}
            className="group flex items-center gap-2 text-sm font-bold text-[#1E3A5F] hover:text-blue-600 transition-colors"
          >
            Explore all destinations
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* ── Main Grid (Popular) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {popular.map((item: any, idx: number) => (
            <div
              key={idx}
              onClick={() => router.push(item.externalLink || `/search?search=${item.title}`)}
              className={cn(
                "group relative h-96 overflow-hidden rounded-[2.5rem] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500",
                idx === 1 || idx === 2 ? "md:translate-y-6" : "" // Subtle staggered effect
              )}
            >
              <img
                src={item.featuredImage}
                alt={item.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80";
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                     <MapPin className="w-3 h-3 text-white" />
                   </div>
                   <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                     {item.count || "Featured"}
                   </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                  {item.content}
                </p>
                <div className="h-0 group-hover:h-8 transition-all duration-500 overflow-hidden mt-2">
                   <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                     View Stays <ArrowRight className="w-3 h-3" />
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Regions Row ── */}
        <div className="relative mt-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#1E3A5F]">Browse by Region</h3>
            <div className="flex gap-2">
               {/* Decorative dots */}
               <div className="w-2 h-2 rounded-full bg-blue-100" />
               <div className="w-2 h-2 rounded-full bg-blue-200" />
               <div className="w-2 h-2 rounded-full bg-[#1E3A5F]" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {regions.map((region: any, idx: number) => (
              <div
                key={idx}
                onClick={() => router.push(region.externalLink || `/search?search=${region.title}`)}
                className="group relative h-40 md:h-48 overflow-hidden rounded-3xl cursor-pointer hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={region.featuredImage}
                  alt={region.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80";
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#1E3A5F]/40 group-hover:bg-[#1E3A5F]/20 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                   <Compass className="w-6 h-6 text-white/50 group-hover:text-white group-hover:scale-110 transition-all mb-2" />
                   <h4 className="text-white font-bold text-base md:text-lg">{region.title}</h4>
                   <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     Explore Region
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Final Push ── */}
        {/* <div className="mt-20 p-8 md:p-12 bg-[#F8FAFC] border border-gray-100 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
               <h4 className="text-2xl font-bold text-[#1E3A5F] mb-2">Can't decide where to go?</h4>
               <p className="text-gray-500 text-sm">Let our travel experts help you plan the perfect itinerary for your Sri Lankan adventure.</p>
            </div>
            <button className="px-8 py-4 bg-[#1E3A5F] text-white rounded-2xl font-bold hover:bg-[#162d4a] transition-all shadow-lg hover:shadow-blue-900/20 active:scale-95">
               Get Free Travel Advice
            </button>
        </div> */}
      </div>
    </section>
  );
}
