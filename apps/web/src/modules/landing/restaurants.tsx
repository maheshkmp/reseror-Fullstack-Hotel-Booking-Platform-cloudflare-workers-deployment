import { getClient } from "@/lib/rpc/server";
import Link from "next/link";
import { PublicRestaurantCard } from "@/features/resturant/components/public-restaurant-card";
import { Restaurant } from "core/zod";

type RestaurantImage = {
  id: string;
  restaurantId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
  createdAt?: string;
  updatedAt?: string | null;
};

type Props = {};

export async function FeaturedRestaurants({}: Props) {
  const rpcClient = await getClient();

  // Fetch restaurants with limit=8 to match hotels section grid
  let restaurants: any[] = [];
  const imagesMap: Record<string, RestaurantImage[]> = {};

  try {
    const restaurantsRes = await rpcClient.api.restaurant.$get({
      query: {
        page: "1",
        limit: "8",
        sort: "desc",
      },
    });

    if (restaurantsRes.ok) {
      const apiResponse = await restaurantsRes.json();
      restaurants = apiResponse.data || [];

      await Promise.all(
        restaurants.map(async (restaurant) => {
          try {
            const imagesRes = await rpcClient.api.restaurant[
              restaurant.id
            ].images.$get({
              query: {
                page: "1",
                limit: "10",
                sort: "desc",
              },
            });
            if (imagesRes.ok) {
              const imagesData = await imagesRes.json();
              imagesMap[restaurant.id] = imagesData.data;
            }
          } catch (e) {
            imagesMap[restaurant.id] = [];
          }
        })
      );
    }
  } catch (err) {
    console.error("Failed to fetch restaurants", err);
  }

  // Use hardcoded high-quality fallback restaurants if database is empty
  if (!restaurants || restaurants.length === 0) {
    restaurants = [
      {
        id: "dummy-rest-1",
        name: "Ministry of Crab",
        city: "Colombo",
        country: "Sri Lanka",
        starRating: 5,
        description: "World-renowned seafood restaurant in Dutch Hospital Colombo serving authentic mud crab.",
        phone: "+94 11 123 4567",
        website: "https://ministryofcrab.com"
      },
      {
        id: "dummy-rest-2",
        name: "Nihonbashi Japanese",
        city: "Colombo",
        country: "Sri Lanka",
        starRating: 5,
        description: "Premium Japanese dining featuring fresh sashimi, yakitori, and authentic sake pairings.",
        phone: "+94 11 987 6543",
        website: "https://nihonbashi.lk"
      },
      {
        id: "dummy-rest-3",
        name: "The Gallery Café",
        city: "Colombo",
        country: "Sri Lanka",
        starRating: 4,
        description: "Housed in Geoffrey Bawa's former office, offering contemporary international cuisine and desserts.",
        phone: "+94 11 555 4321",
        website: "https://paradiseroad.lk"
      },
      {
        id: "dummy-rest-4",
        name: "Galle Fort Hotel Restaurant",
        city: "Galle",
        country: "Sri Lanka",
        starRating: 5,
        description: "Fusion dining combining Sri Lankan spices with European fine dining in historic Galle Fort.",
        phone: "+94 91 444 3322",
        website: "https://galleforthotel.com"
      }
    ];

    imagesMap["dummy-rest-1"] = [{ id: "i1", restaurantId: "dummy-rest-1", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80" }];
    imagesMap["dummy-rest-2"] = [{ id: "i2", restaurantId: "dummy-rest-2", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80" }];
    imagesMap["dummy-rest-3"] = [{ id: "i3", restaurantId: "dummy-rest-3", imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80" }];
    imagesMap["dummy-rest-4"] = [{ id: "i4", restaurantId: "dummy-rest-4", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80" }];
  }

  return (
    <section className="py-14 px-4 md:px-6 lg:px-8 bg-white">
      {/* Section Header - Matching FeaturedHotels style */}
      <div className="max-w-5xl mx-auto mb-8 flex items-end justify-between">
        <div>
          <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">
            Culinary Excellence
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1E3A5F]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Featured Restaurants
          </h2>
          <p className="text-gray-500 mt-2">
            Discover handpicked dining experiences for your next meal
          </p>
        </div>
        <Link
          href="/restaurants"
          className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-[#1E3A5F] hover:text-blue-600 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="max-w-5xl mx-auto flex sm:flex-wrap sm:justify-center lg:grid lg:grid-cols-4 justify-start gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-auto sm:px-0">
        {restaurants.slice(0, 8).map((restaurant) => {
          const images = imagesMap[restaurant.id] || [];
          return (
            <div key={restaurant.id} className="w-[85vw] sm:w-auto shrink-0 snap-center sm:snap-align-none">
              <PublicRestaurantCard 
                restaurant={{ ...restaurant, images } as any} 
                className="h-full" 
              />
            </div>
          );
        })}
      </div>

      {/* Mobile view all */}
      <div className="max-w-7xl mx-auto mt-8 flex justify-center md:hidden">
        <Link
          href="/restaurants"
          className="px-6 py-3 bg-[#1E3A5F] hover:bg-[#162d4a] transition-colors text-white rounded-xl font-semibold text-sm"
        >
          Explore All Restaurants
        </Link>
      </div>
    </section>
  );
}

