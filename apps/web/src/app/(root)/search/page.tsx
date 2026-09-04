import HotelSearchComponent from "@/features/hotels/components/advanced-search";
import { SearchTabs } from "@/features/hotels/components/search-tabs";
import { NoResults } from "@/features/hotels/components/no-results";
import { SearchFilters } from "@/features/hotels/components/search-filters";
import { Pagination } from "@/features/hotels/components/search-pagination";
import { SearchResults } from "@/features/hotels/components/search-results";
import { ResultScroller } from "@/features/hotels/components/result-scroller";
import { transformHotelsData } from "@/features/hotels/utils/transforms";
import { getClient } from "@/lib/rpc/server";
import { Suspense } from "react";
import { ActiveFilterChips } from "@/features/hotels/components/active-filter-chips";
import { HotelMapView } from "@/features/hotels/components/hotel-map-view";
import { ViewToggle } from "@/features/hotels/components/view-toggle";
import Link from "next/link";
import { MapIcon } from "lucide-react";
import { MobileFilterDrawer } from "@/features/hotels/components/mobile-filter-drawer";

// Update SearchParams type
type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  rooms?: string;
  hotelType?: string;
  propertyClass?: string;
  roomTypes?: string; // comma-separated room type names
  brandName?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "asc" | "desc";
  viewTypes?: string;
  // New filter params
  stars?: string;
  reviewScore?: string;
  facilities?: string;
  travelGroup?: string;
  tags?: string;
  view?: "list" | "map";
};

export const metadata = {
  title: "Search Hotels | Reseror",
  description:
    "Find your perfect accommodation from our extensive collection of hotels.",
};

/**
 * Loading skeleton for the results area
 */
function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="bg-white rounded-[32px] border border-gray-100 p-5 flex flex-col md:flex-row gap-6 relative overflow-hidden"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
          
          <div className="w-full md:w-[280px] h-[200px] bg-gray-100 rounded-2xl animate-pulse shrink-0" />
          
          <div className="flex-1 space-y-4 py-2">
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-full">
                <div className="h-6 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded-md w-1/2 animate-pulse" />
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse" />
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-gray-100 rounded-md w-full animate-pulse opacity-60" />
              <div className="h-4 bg-gray-100 rounded-md w-2/3 animate-pulse opacity-60" />
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-gray-50">
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded-md w-16 animate-pulse" />
                <div className="h-8 bg-gray-100 rounded-lg w-28 animate-pulse" />
              </div>
              <div className="h-11 bg-gray-100 rounded-xl w-32 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for the map view
 */
function MapSkeleton() {
  return (
    <div className="relative w-full h-[calc(100vh-200px)] lg:h-[calc(100vh-240px)] rounded-[32px] overflow-hidden border border-gray-100 bg-gray-100 animate-pulse">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <MapIcon className="w-8 h-8 text-gray-400" />
          </div>
          <div className="space-y-2 text-center">
            <div className="h-4 w-32 bg-gray-200 rounded-md mx-auto" />
            <div className="h-3 w-48 bg-gray-200 rounded-md mx-auto opacity-60" />
          </div>
        </div>
      </div>

      {/* Mock Markers */}
      {[
        { t: '20%', l: '30%' },
        { t: '45%', l: '60%' },
        { t: '70%', l: '40%' },
        { t: '30%', l: '75%' },
        { t: '60%', l: '20%' },
      ].map((pos, i) => (
        <div 
          key={i}
          className="absolute w-10 h-10 rounded-full bg-gray-200/50 border border-white/50 backdrop-blur-sm"
          style={{ top: pos.t, left: pos.l }}
        />
      ))}
    </div>
  );
}

/**
 * Async component that handles the actual hotel data fetching and rendering
 */
async function HotelListContent({ searchParams }: { searchParams: SearchParams }) {
  const {
    page = "1",
    limit = "9",
    search = "",
    hotelType = "",
    propertyClass = "",
    roomTypes = "",
    brandName = "",
    minPrice = "",
    maxPrice = "",
    sort = "desc",
    viewTypes = "",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stars = "",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reviewScore = "",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    facilities = "",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    travelGroup = "",
    tags = "",
    view = "list",
  } = searchParams;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const minPriceNum = minPrice ? parseFloat(minPrice) : null;
  const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null;

  const rpcClient = await getClient();

  try {
    const [hotelsRes] = await Promise.all([
      rpcClient.api.hotels.$get({
        query: {
          page,
          limit,
          search,
          hotelType,
          propertyClass,
          sort,
          tags,
          status: "active",
        },
      }),
    ]);

    if (!hotelsRes.ok) {
      return (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <p className="text-gray-500">Something went wrong while fetching hotels. Please try again.</p>
        </div>
      );
    }

    const apiResponse = await hotelsRes.json();
    const transformedData = transformHotelsData(apiResponse.data);
    let filteredHotels = transformedData;

    // Filter by brand name if specified
    if (brandName) {
      filteredHotels = filteredHotels.filter(
        (hotel: any) =>
          hotel.brandName &&
          hotel.brandName.toLowerCase() === brandName.toLowerCase()
      );
    }

    // Filter by room types and price if specified
    if (
      roomTypes ||
      minPriceNum !== null ||
      maxPriceNum !== null ||
      viewTypes
    ) {
      const selectedRoomTypes = roomTypes
        ? roomTypes.split(",").filter(Boolean)
        : [];
      const selectedViewTypes = viewTypes
        ? viewTypes.split(",").filter(Boolean)
        : [];

      // Fetch room types for each hotel and filter
      const hotelsWithRoomTypes = await Promise.all(
        filteredHotels.map(async (hotel: any) => {
          try {
            const roomTypesRes = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/${hotel.id}/room-types?page=1&limit=100`
            );

            if (roomTypesRes.ok) {
              const roomTypesData = await roomTypesRes.json();
              const hotelRoomTypes = roomTypesData.data;

              // Check room type filter
              let hasSelectedRoomType = true;
              if (selectedRoomTypes.length > 0) {
                hasSelectedRoomType = selectedRoomTypes.some((roomType) =>
                  hotelRoomTypes.some((hotelRoomType: any) =>
                    hotelRoomType.name
                       .toLowerCase()
                       .includes(roomType.toLowerCase())
                  )
                );
              }

              // Check price filter
              let hasRoomInPriceRange = true;
              if (minPriceNum !== null || maxPriceNum !== null) {
                hasRoomInPriceRange = hotelRoomTypes.some((roomType: any) => {
                  if (!roomType.price) return false;

                  const price = parseFloat(roomType.price);
                  const minCheck = minPriceNum === null || price >= minPriceNum;
                  const maxCheck = maxPriceNum === null || price <= maxPriceNum;

                  return minCheck && maxCheck;
                });
              }

              // Check view type filter
              let hasSelectedViewType = true;
              if (selectedViewTypes.length > 0) {
                hasSelectedViewType = hotelRoomTypes.some((roomType: any) =>
                  selectedViewTypes.includes(roomType.viewType)
                );
              }

              // Hotel must satisfy all conditions
              return hasSelectedRoomType &&
                hasRoomInPriceRange &&
                hasSelectedViewType
                ? hotel
                : null;
            }
            return null;
          } catch (error) {
            return null;
          }
        })
      );

      filteredHotels = hotelsWithRoomTypes.filter(Boolean);
    }

    const totalCount = filteredHotels.length;
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Apply pagination to filtered results
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

    if (paginatedHotels.length === 0) {
      return (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <NoResults searchTerm={search} />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight mb-1">
              {totalCount} properties in Sri Lanka
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Fully refundable properties
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sort by</span>
            <select 
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              defaultValue={sort}
            >
              <option value="desc">Recommended</option>
              <option value="asc">Price (low to high)</option>
              <option value="price_desc">Price (high to low)</option>
              <option value="rating">Guest rating</option>
            </select>
            
            <div className="hidden md:block">
              <ViewToggle />
            </div>
          </div>
        </div>

        {view === "map" ? (
          <HotelMapView hotels={paginatedHotels as any} />
        ) : (
          <SearchResults hotels={paginatedHotels as any} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 pt-12 text-center">
            <div className="flex items-center gap-1">
              <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                baseUrl="/search"
                searchParams={searchParams}
              />
            </div>
            <span className="text-sm text-gray-400 font-medium">
              Showing results {startIndex + 1} – {Math.min(endIndex, totalCount)} of {totalCount}
            </span>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in HotelListContent:", error);
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
        <p className="text-gray-500">Something went wrong while loading results. Please try again.</p>
      </div>
    );
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const {
    search = "",
    checkIn = "",
    checkOut = "",
    guests = "1",
    rooms = "1",
    hotelType = "",
    propertyClass = "",
    roomTypes = "",
    brandName = "",
    minPrice = "",
    maxPrice = "",
    sort = "desc",
    viewTypes = "",
    stars = "",
    reviewScore = "",
    facilities = "",
    travelGroup = "",
    tags = "",
  } = params;

  const rpcClient = await getClient();

  // Fetch static/filter data that doesn't change often
  const [hotelTypesRes] = await Promise.all([
    rpcClient.api.hotels.types.$get({
      query: { page: "1", limit: "50" },
    }),
  ]);

  const hotelTypes = hotelTypesRes.ok ? await hotelTypesRes.json() : [];

  const filterProps = {
    currentSearch: search,
    currentHotelType: hotelType,
    currentPropertyClass: propertyClass,
    currentRoomTypes: roomTypes,
    currentBrandName: brandName,
    currentMinPrice: minPrice,
    currentMaxPrice: maxPrice,
    currentSort: sort,
    currentViewTypes: viewTypes,
    currentStars: stars,
    currentReviewScore: reviewScore,
    currentFacilities: facilities,
    currentTravelGroup: travelGroup,
    currentTags: tags,
  };

  return (
    <div className="min-h-screen bg-[#F1F4F7]">
      {/* Secondary Search/Header Bar - Sticky & Premium */}
      <div className="sticky top-0 z-50 bg-[#003580] shadow-md transition-all duration-300 py-2">
        <div className="container mx-auto px-4 pt-3">
          <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 py-1" >
            <HotelSearchComponent 
              initialDestination={search}
              initialCheckIn={checkIn}
              initialCheckOut={checkOut}
              initialGuests={parseInt(guests)}
              initialRooms={parseInt(rooms)}
            />
          </div>
        </div>
      </div>

      {/* Breadcrumbs & Title */}
      <div className="container mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900">Stays in Sri Lanka</span>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Fixed/Sticky left layout */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-[104px] space-y-6 pb-10">
              {/* ResultScroller monitor */}
              <ResultScroller />
            
            {/* Map Preview Card */}
            <Link 
              href={`/search?${new URLSearchParams({ ...params, view: "map" }).toString()}`}
              className="block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6 relative group cursor-pointer"
            >
              <div className="h-28 bg-[#E5E7EB] relative">
                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=7.8731,80.7718&zoom=7&size=600x300&scale=2')] bg-cover bg-center grayscale-[0.5] opacity-80 transition-all group-hover:grayscale-0 group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 group-hover:scale-105 transition-transform">
                    <MapIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-gray-900">Show on map</span>
                  </div>
                </div>
              </div>
            </Link>

            <SearchFilters {...filterProps} />
          </div>
        </aside>

          {/* Results Area */}
          <main id="search-results-container" className="flex-1 min-w-0">
            {/* Tabs Filter Bar */}
            <div className="flex flex-col space-y-4 mb-6">
              <SearchTabs hotelTypes={hotelTypes || []} />
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterChips />

            {/* Suspended Hotel List */}
            <Suspense 
              key={`${JSON.stringify(params)}-${params.view || 'list'}`} 
              fallback={params.view === "map" ? <MapSkeleton /> : <SearchResultsSkeleton />}
            >
              <HotelListContent searchParams={params} />
            </Suspense>

            {/* "Why book with us" Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Free Cancellation</h3>
                <p className="text-sm text-gray-500">Flexible bookings on most hotels. Because plans change.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No hidden fees</h3>
                <p className="text-sm text-gray-500">The price you see is the price you pay. Simple as that.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-sm text-gray-500">Your data is safe with us. Multiple secure payment options.</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <MobileFilterDrawer filterProps={filterProps} />
    </div>
    
  );
}
