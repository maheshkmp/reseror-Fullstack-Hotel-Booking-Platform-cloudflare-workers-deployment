"use client";

import { useEffect, useRef, useState } from "react";
import { getClient } from "@/lib/rpc/client";
import { transformHotelsData } from "@/features/hotels/utils/transforms";
import { HotelCard } from "@/features/hotels/components/hotel-card";
import { PublicRestaurantCard } from "@/features/resturant/components/public-restaurant-card";
import {
  Building2,
  Home,
  UtensilsCrossed,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ── Constants ── */
const PAGE_SIZE = 8; // items per load-more click

/* ── Tab config ── */
type Tab = "hotels" | "villas" | "apartments" | "restaurants";

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ElementType;
  /** Search page URL with matching query params */
  searchHref: string;
  eyebrow: string;
}

const TABS: TabConfig[] = [
  {
    id: "hotels",
    label: "Hotels",
    icon: Building2,
    searchHref: "/search?hotelType=hotel",
    eyebrow: "Handpicked for you",
  },
  {
    id: "villas",
    label: "Private Villas",
    icon: Home,
    searchHref: "/search?hotelType=villa",
    eyebrow: "Exclusive living",
  },
  {
    id: "apartments",
    label: "Apartments",
    icon: Building2,
    searchHref: "/search?hotelType=apartment",
    eyebrow: "Modern living",
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: UtensilsCrossed,
    searchHref: "/search?hotelType=restaurant",
    eyebrow: "Culinary excellence",
  },
];

/* ── Reverse geocode ── */
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) return "";
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      ""
    );
  } catch {
    return "";
  }
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 animate-pulse bg-white">
      <div className="aspect-[3/2] bg-gray-200" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-px bg-gray-100 mt-2" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

/* ── Main component ── */
export function FeaturedPlaces() {
  const [activeTab, setActiveTab] = useState<Tab>("hotels");

  // All fetched data
  const [hotels, setHotels] = useState<any[]>([]);
  const [villas, setVillas] = useState<any[]>([]);
  const [apartments, setApartments] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  // Hotel types from API
  const [hotelTypes, setHotelTypes] = useState<any[]>([]);

  // Loading states per tab
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [loadingVillas, setLoadingVillas] = useState(true);
  const [loadingApartments, setLoadingApartments] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  // Desktop "load more" — tracks how many items are visible per tab
  const [visibleCounts, setVisibleCounts] = useState<Record<Tab, number>>({
    hotels: PAGE_SIZE,
    villas: PAGE_SIZE,
    apartments: PAGE_SIZE,
    restaurants: PAGE_SIZE,
  });

  // Load-more loading spinner
  const [loadingMore, setLoadingMore] = useState(false);

  // Geolocation
  const [city, setCity] = useState<string>("");
  const [geoLoading, setGeoLoading] = useState(true);

  // Mobile scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* ── Geolocation ── */
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const name = await reverseGeocode(coords.latitude, coords.longitude);
        setCity(name);
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 6000 }
    );
  }, []);

  /* ── Fetch Property Types ── */
  useEffect(() => {
    (async () => {
      try {
        const rpc = await getClient();
        const res = await rpc.api.hotels.types.$get();
        if (res.ok) {
          const json = await res.json();
          setHotelTypes(json);
        }
      } catch { /* silent */ }
    })();
  }, []);

  /* ── Fetch hotels ── */
  useEffect(() => {
    if (hotelTypes.length === 0) return;
    (async () => {
      try {
        const hotelType = hotelTypes.find(t => t.name.toLowerCase() === "hotel");
        const rpc = await getClient();
        const res = await rpc.api.hotels.$get({
          query: { 
            page: "1", 
            limit: "20", 
            sort: "desc", 
            status: "active",
            ...(hotelType && { hotelType: hotelType.id })
          },
        });
        if (res.ok) {
          const json = await res.json();
          setHotels(transformHotelsData(json.data ?? []) as any[]);
        }
      } catch { /* silent */ }
      finally { setLoadingHotels(false); }
    })();
  }, [hotelTypes]);

  /* ── Fetch villas ── */
  useEffect(() => {
    if (hotelTypes.length === 0) return;
    (async () => {
      try {
        const villaType = hotelTypes.find(t => t.name.toLowerCase() === "villa");
        const rpc = await getClient();
        const res = await rpc.api.hotels.$get({
          query: { 
            page: "1", 
            limit: "20", 
            sort: "desc", 
            status: "active",
            ...(villaType && { hotelType: villaType.id })
          },
        });
        if (res.ok) {
          const json = await res.json();
          setVillas(transformHotelsData(json.data ?? []) as any[]);
        }
      } catch { /* silent */ }
      finally { setLoadingVillas(false); }
    })();
  }, [hotelTypes]);

  /* ── Fetch apartments ── */
  useEffect(() => {
    if (hotelTypes.length === 0) return;
    (async () => {
      try {
        const apartmentType = hotelTypes.find(t => t.name.toLowerCase() === "apartment");
        const rpc = await getClient();
        const res = await rpc.api.hotels.$get({
          query: { 
            page: "1", 
            limit: "20", 
            sort: "desc", 
            status: "active",
            ...(apartmentType && { hotelType: apartmentType.id })
          },
        });
        if (res.ok) {
          const json = await res.json();
          setApartments(transformHotelsData(json.data ?? []) as any[]);
        }
      } catch { /* silent */ }
      finally { setLoadingApartments(false); }
    })();
  }, [hotelTypes]);

  /* ── Fetch restaurants ── */
  useEffect(() => {
    (async () => {
      try {
        const rpc = await getClient();
        const res = await rpc.api.restaurant.$get({
          query: { page: "1", limit: "20", sort: "desc", status: "active" },
        });
        if (res.ok) {
          const json = await res.json();
          const list: any[] = json.data ?? [];
          const imagesMap: Record<string, any[]> = {};
          await Promise.allSettled(
            list.map(async (r) => {
              try {
                const ir = await rpc.api.restaurant[r.id].images.$get({
                  query: { page: "1", limit: "10", sort: "desc" },
                });
                if (ir.ok) { const d = await ir.json(); imagesMap[r.id] = d.data ?? []; }
              } catch {}
            })
          );
          setRestaurants(list.map((r) => ({ ...r, images: imagesMap[r.id] ?? [] })));
        }
      } catch { /* silent */ }
      finally { setLoadingRestaurants(false); }
    })();
  }, []);

  // Mobile scroll tracking
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    
    // Update scroll progress for dots indicator
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(el.scrollLeft / maxScroll);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    setScrollProgress(0);
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [activeTab]);

  const scrollBy = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  /* ── Derived values ── */
  const tabCfg = TABS.find((t) => t.id === activeTab)!;

  const allItems =
    activeTab === "hotels"
      ? hotels
      : activeTab === "villas"
      ? villas
      : activeTab === "apartments"
      ? apartments
      : restaurants;

  const isLoading =
    activeTab === "hotels"
      ? loadingHotels
      : activeTab === "villas"
      ? loadingVillas
      : activeTab === "apartments"
      ? loadingApartments
      : loadingRestaurants;

  const visibleCount = visibleCounts[activeTab];
  const desktopItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  const locationLabel = geoLoading ? null : city ? `Near ${city}` : null;

  /* ── Load more handler ── */
  const handleLoadMore = async () => {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 400));
    setVisibleCounts((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + PAGE_SIZE,
    }));
    setLoadingMore(false);
  };

  /* ── Tab switch reset scroll ── */
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  /* ── Card renderer ── */
  const renderCard = (item: any, i: number) => (
    <div key={item.id || i} className="h-full snap-start sm:snap-align-none">
      {activeTab === "hotels" && <HotelCard hotel={item} className="h-full" />}
      {activeTab === "villas" && <HotelCard hotel={item} className="h-full" />}
      {activeTab === "apartments" && <HotelCard hotel={item} className="h-full" />}
      {activeTab === "restaurants" && <PublicRestaurantCard restaurant={item} className="h-full" />}
    </div>
  );

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">

      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-8">
        <div className="flex items-start md:items-end justify-between gap-4 flex-wrap">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {tabCfg.eyebrow}
              </span>
              {locationLabel && (
                <span className="inline-flex items-center gap-1 text-[10px] md:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <MapPin className="w-2.5 h-2.5" />
                  {locationLabel}
                </span>
              )}
              {geoLoading && <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />}
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E3A5F] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Featured Places to Stay
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base max-w-md">
              Discover top-rated accommodations for your perfect getaway
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={tabCfg.searchHref}
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[#1E3A5F] hover:text-blue-600 transition-all group px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              View all
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            {/* Scroll controls (always visible on small screens when content is scrollable) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollBy("left")}
                disabled={!canScrollLeft}
                className="w-9 h-9 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:border-gray-200 disabled:opacity-20 transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollBy("right")}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:border-gray-200 disabled:opacity-20 transition-all shadow-sm active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs with Fade Mask ── */}
        <div className="relative mt-8 group/tabs">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden" />
          
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-1 border-b border-gray-100">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative flex items-center gap-2 pb-3 text-sm font-bold transition-all duration-200 whitespace-nowrap active:scale-95
                    ${active ? "text-[#1E3A5F]" : "text-gray-400 hover:text-gray-600"}
                  `}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-600" : ""}`} />
                  {tab.label}
                  {active && (
                    <motion.span 
                      layoutId="activeTab"
                      className="absolute left-0 bottom-[-1px] h-[2px] w-full bg-[#1E3A5F]" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MOBILE: horizontal scroll slider ── */}
      <div className="md:hidden relative">
        {/* Edge fades */}
        <div className={`absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"}`} />

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 pb-8 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Start Spacer */}
          <div className="flex-shrink-0 w-1 snap-start" />
          
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[82vw] snap-start">
                  <SkeletonCard />
                </div>
              ))
            : allItems.length === 0
            ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-gray-400 gap-2 w-full">
                <tabCfg.icon className="w-10 h-10 opacity-30" />
                <p className="text-sm font-medium">No {tabCfg.label.toLowerCase()} found</p>
              </div>
            )
            : allItems.map((item, i) => (
                <div key={item.id || i} className="flex-shrink-0 w-[82vw] snap-start">
                  {renderCard(item, i)}
                </div>
              ))}
              
          {/* End Spacer */}
          <div className="flex-shrink-0 w-4 snap-end" />
        </div>

        {/* Page Indicator (Dots) */}
        {!isLoading && allItems.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-[-10px]">
            {allItems.slice(0, Math.min(allItems.length, 6)).map((_, i) => {
              const count = Math.min(allItems.length, 6);
              const isActive = Math.round(scrollProgress * (count - 1)) === i;
              return (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${isActive ? "w-4 bg-[#1E3A5F]" : "w-1 bg-gray-200"}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── DESKTOP: 4-col grid, max 2 rows = 8 items, then load more ── */}
      <div className="hidden md:block max-w-5xl mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3 border-2 border-dashed border-gray-50 rounded-3xl">
            <tabCfg.icon className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">No {tabCfg.label.toLowerCase()} found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {desktopItems.map((item, i) => renderCard(item, i))}
          </div>
        )}

        {/* ── Load More ── */}
        {!isLoading && hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-gray-100 text-[#1E3A5F] font-bold text-sm hover:border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-all duration-300 disabled:opacity-50 active:scale-95 shadow-sm hover:shadow-md"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating List…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Load more {tabCfg.label.toLowerCase()}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile: View all button ── */}
      <div className="md:hidden max-w-5xl mx-auto px-4 mt-6 flex items-center gap-3">
        <Link
          href={tabCfg.searchHref}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#1E3A5F] hover:bg-[#162d4a] transition-all text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/10 active:scale-[0.98]"
        >
          View All {tabCfg.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
