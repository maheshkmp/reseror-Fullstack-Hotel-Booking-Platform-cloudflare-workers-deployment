import { HotelCard } from "@/features/hotels/components/hotel-card";
import { transformHotelsData } from "@/features/hotels/utils/transforms";
import { getClient } from "@/lib/rpc/server";
import Link from "next/link";

type Props = {};

export async function FeaturedHotels({}: Props) {
  const rpcClient = await getClient();

  let hotelsList: any[] = [];

  try {
    const hotelsRes = await rpcClient.api.hotels.$get({
      query: {
        page: "1",
        limit: "8",
        sort: "desc",
        status: "active",
      },
    });

    if (hotelsRes.ok) {
      const apiResponse = await hotelsRes.json();
      const transformedData = transformHotelsData(apiResponse.data);
      hotelsList = transformedData;
    }
  } catch (err) {
    console.error("Failed to fetch hotels", err);
  }

  // Use high-resolution hardcoded fallback hotels if database is empty
  if (!hotelsList || hotelsList.length === 0) {
    hotelsList = [
      {
        id: "dummy-hotel-1",
        name: "Cinnamon Grand Colombo",
        city: "Colombo",
        country: "Sri Lanka",
        starRating: 5,
        propertyClass: { name: "5 STAR" },
        images: [
          { imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80", altText: "Cinnamon Grand" }
        ],
        roomTypes: [{ price: "180" }],
        performance: { totalBookings: 1420 }
      },
      {
        id: "dummy-hotel-2",
        name: "Heritance Kandalama",
        city: "Dambulla",
        country: "Sri Lanka",
        starRating: 5,
        propertyClass: { name: "LUXURY RESORT" },
        images: [
          { imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80", altText: "Heritance Kandalama" }
        ],
        roomTypes: [{ price: "240" }],
        performance: { totalBookings: 980 }
      },
      {
        id: "dummy-hotel-3",
        name: "Amangalla Galle Fort",
        city: "Galle",
        country: "Sri Lanka",
        starRating: 5,
        propertyClass: { name: "BOUTIQUE" },
        images: [
          { imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80", altText: "Amangalla Galle" }
        ],
        roomTypes: [{ price: "310" }],
        performance: { totalBookings: 650 }
      },
      {
        id: "dummy-hotel-4",
        name: "Jetwing Lighthouse",
        city: "Galle",
        country: "Sri Lanka",
        starRating: 5,
        propertyClass: { name: "BEACHFRONT" },
        images: [
          { imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80", altText: "Jetwing Lighthouse" }
        ],
        roomTypes: [{ price: "195" }],
        performance: { totalBookings: 1120 }
      }
    ];
  }

  return (
    <section className="py-14 px-4 md:px-6 lg:px-8 bg-white">
      {/* Section Header */}
      <div className="max-w-5xl mx-auto mb-8 flex items-end justify-between">
        <div>
          <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">
            Handpicked for you
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1E3A5F]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Featured Places to Stay
          </h2>
          <p className="text-gray-500 mt-2">
            Discover top-rated accommodations for your perfect getaway
          </p>
        </div>
        <Link
          href="/hotels"
          className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-[#1E3A5F] hover:text-blue-600 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="max-w-5xl mx-auto flex sm:flex-wrap sm:justify-center lg:grid lg:grid-cols-4 justify-start gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-auto sm:px-0">
        {hotelsList.slice(0, 8).map((hotel: any) => (
          <div key={hotel.id} className="w-[85vw] sm:w-auto shrink-0 snap-center sm:snap-align-none">
            <HotelCard hotel={hotel as any} className="h-full" />
          </div>
        ))}
      </div>

      {/* Mobile view all */}
      <div className="max-w-7xl mx-auto mt-8 flex justify-center md:hidden">
        <Link
          href="/hotels"
          className="px-6 py-3 bg-[#1E3A5F] hover:bg-[#162d4a] transition-colors text-white rounded-xl font-semibold text-sm"
        >
          View All Properties
        </Link>
      </div>
    </section>
  );
}
