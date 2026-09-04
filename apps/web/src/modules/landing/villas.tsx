import { getClient } from "@/lib/rpc/server";
import Link from "next/link";
import { PublicVillaCard } from "@/features/villas/components/public-villa-card";
import { Villa } from "core/zod";

type VillaImage = {
  id: string;
  villaId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
  createdAt?: string;
  updatedAt?: string | null;
};

type Props = {};

export async function FeaturedVillas({ }: Props) {
  const rpcClient = await getClient();

  // Fetch villas with limit=8 to match the property section grid
  let villas: any[] = [];
  const imagesMap: Record<string, VillaImage[]> = {};

  try {
    const villasRes = await rpcClient.api.villa.$get({
      query: {
        page: "1",
        limit: "8",
        sort: "desc",
      },
    });

    if (villasRes.ok) {
      const apiResponse = await villasRes.json();
      villas = apiResponse.data || [];

      await Promise.all(
        villas.map(async (villa) => {
          try {
            const imagesRes = await rpcClient.api.villa.types[
              villa.id
            ].images.$get({
              query: {
                page: "1",
                limit: "10",
                sort: "desc",
              },
            });
            if (imagesRes.ok) {
              const imagesData = await imagesRes.json();
              imagesMap[villa.id] = imagesData.data;
            }
          } catch (e) {
            imagesMap[villa.id] = [];
          }
        })
      );
    }
  } catch (err) {
    console.error("Failed to fetch villas", err);
  }

  // Use hardcoded high-quality fallback villas if database is empty
  if (!villas || villas.length === 0) {
    villas = [
      {
        id: "dummy-villa-1",
        name: "Ani Private Resort Villa",
        city: "Dikwella",
        country: "Sri Lanka",
        starRating: 5,
        description: "Clifftop 15-bedroom luxury estate featuring private chef, butler service, infinity pools, and ocean views."
      },
      {
        id: "dummy-villa-2",
        name: "Cape Weligama Luxury Villa",
        city: "Weligama",
        country: "Sri Lanka",
        starRating: 5,
        description: "Cliffside private villa with moon pool, panoramic Indian ocean views and personalized concierge."
      },
      {
        id: "dummy-villa-3",
        name: "Dutch House Villa",
        city: "Galle",
        country: "Sri Lanka",
        starRating: 5,
        description: "Colonial 18th-century country mansion set in tropical gardens close to historic Galle Fort."
      },
      {
        id: "dummy-villa-4",
        name: "Kahanda Kanda Villa",
        city: "Koggala",
        country: "Sri Lanka",
        starRating: 5,
        description: "Secluded hilltop villa surrounded by tea plantations and peacocks with private lap pool."
      }
    ];

    imagesMap["dummy-villa-1"] = [{ id: "v1", villaId: "dummy-villa-1", imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80" }];
    imagesMap["dummy-villa-2"] = [{ id: "v2", villaId: "dummy-villa-2", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80" }];
    imagesMap["dummy-villa-3"] = [{ id: "v3", villaId: "dummy-villa-3", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80" }];
    imagesMap["dummy-villa-4"] = [{ id: "v4", villaId: "dummy-villa-4", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80" }];
  }

  return (
    <section className="py-14 px-4 md:px-6 lg:px-8 bg-white">
      {/* Section Header - Matching the premium style */}
      <div className="max-w-5xl mx-auto mb-8 flex items-end justify-between">
        <div>
          <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">
            Exclusive Living
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1E3A5F]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Featured Private Villas
          </h2>
          <p className="text-gray-500 mt-2">
            Experience the ultimate in privacy and luxury with our handpicked villas
          </p>
        </div>
        <Link
          href="/villas"
          className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-[#1E3A5F] hover:text-blue-600 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="max-w-5xl mx-auto flex sm:flex-wrap sm:justify-center lg:grid lg:grid-cols-4 justify-start gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-auto sm:px-0">
        {villas.slice(0, 8).map((villa) => {
          const images = imagesMap[villa.id] || [];
          return (
            <div key={villa.id} className="w-[85vw] sm:w-auto shrink-0 snap-center sm:snap-align-none">
              <PublicVillaCard
                villa={{ ...villa, images } as any}
                className="h-full"
              />
            </div>
          );
        })}
      </div>

      {/* Mobile view all */}
      <div className="max-w-7xl mx-auto mt-8 flex justify-center md:hidden">
        <Link
          href="/villas"
          className="px-6 py-3 bg-[#1E3A5F] hover:bg-[#162d4a] transition-colors text-white rounded-xl font-semibold text-sm"
        >
          Explore All Villas
        </Link>
      </div>
    </section>
  );
}
