// "use client";

// import { useGetWishlist } from "@/features/wishlist/actions/use-get-wishlist";
// import { WishlistCard } from "@/features/wishlist/components/wishlist.card";

// export default function WishlistPage() {
//   const { data, isLoading, error } = useGetWishlist({ page: 1, limit: 20 });

//   if (isLoading) {
//     return <div className="p-8">Loading wishlist...</div>;
//   }
//   if (error) {
//     return <div className="p-8 text-red-500">Failed to load wishlist</div>;
//   }
//   if (!data?.data?.length) {
//     return <div className="p-8">No wishlist items found.</div>;
//   }

//   return (
//     <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
//       {data.data.map((item: any) =>
//         item.hotelId ? (
//           <WishlistCard key={item.id} hotelId={item.hotelId} />
//         ) : null
//       )}
//     </div>
//   );
// }

"use client";

import { useGetWishlist } from "@/features/wishlist/actions/use-get-wishlist";
import { WishlistCard } from "@/features/wishlist/components/wishlist.card";
import { Calendar, Heart, MapPin } from "lucide-react";

export default function WishlistPage() {
  const { data, isLoading, error } = useGetWishlist({ page: 1, limit: 20 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br ">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-[#003580]" />
              <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your carefully curated collection of dream destinations
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load your wishlist right now. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-[#003580]" />
              <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your carefully curated collection of dream destinations
            </p>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-50/50 flex items-center justify-center rounded-full mx-auto mb-6 w-24 h-24">
              <Heart className="h-12 w-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your dream vacation by adding hotels that catch
              your eye. Every great journey begins with a wishlist!
            </p>

            {/* Call to Action */}
            <div className="space-y-4">
                <button
                className="bg-[#003580] hover:bg-[#002a66] p-3 text-white rounded-lg px-8 py-3"
                onClick={() => window.location.href = "/"}
                >
                Explore Hotels
                </button>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-8">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Discover destinations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Save favorites</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Plan your trip</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-[#003580]" />
            <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Your carefully curated collection of dream destinations
          </p>

          {/* Stats */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-600 border">
            <Heart className="h-4 w-4 text-[#003580] fill-current" />
            <span className="font-medium">{data.data.length}</span>
            <span>
              {data.data.length === 1 ? "hotel saved" : "hotels saved"}
            </span>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {data.data.map((item: any) =>
            item.hotelId ? (
              <div
                key={item.id}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <WishlistCard id={item.id} hotelId={item.hotelId} />
              </div>
            ) : null
          )}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16 py-8 border-t border-blue-100">
          <p className="text-gray-600 mb-4">
            Ready to turn your wishlist into reality?
          </p>
          <button className="bg-[#003580] hover:bg-[#002a66] transition-colors">
            Start Planning Your Trip
          </button>
        </div>
      </div>
    </div>
  );
}
