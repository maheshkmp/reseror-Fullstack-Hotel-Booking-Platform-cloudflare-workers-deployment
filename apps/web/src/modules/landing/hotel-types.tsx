import { transformDatesRecursive } from "@/features/hotels/utils/transforms";
import { getClient } from "@/lib/rpc/server";
import { cn, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

type Props = {};

export async function HotelTypes({}: Props) {
  const rpcClient = await getClient();

  // Reusing the destinations endpoint which stores 'Property Type' category
  const destinationsRes = await rpcClient.api.destinations.$get({
    query: {
      page: "1",
      limit: "24",
    },
  });

  if (!destinationsRes.ok) {
    return null;
  }

  const apiResponse = await destinationsRes.json();
  const allData = Array.isArray(apiResponse)
    ? apiResponse
    : (apiResponse as any).data || [];

  // Filter for Property Type category
  const propertyTypes = allData.filter(
    (item: any) => item.category === "Property Type"
  );

  if (propertyTypes.length === 0) {
    return null;
  }

  const hotelTypesData = transformDatesRecursive(propertyTypes);

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 
              className="text-3xl md:text-4xl font-extrabold text-[#1E3A5F]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Browse by Property Type
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base max-w-lg leading-relaxed">
              From luxurious beach resorts to scenic mountain villas, find the perfect configuration for your stay.
            </p>
          </div>
          <div className="hidden md:flex gap-2 mb-1">
             <div className="w-10 h-1 bg-blue-100 rounded-full" />
             <div className="w-4 h-1 bg-[#1E3A5F] rounded-full" />
          </div>
        </div>

        {/* ── Carousel ── */}
        <div className="relative group">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 pb-4">
              {hotelTypesData.map((item: any, index: number) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-[70%] sm:basis-1/3 lg:basis-1/4"
                >
                  <Link
                    href={item.externalLink || `/search?hotelType=${item.id}`}
                    className="block group/item"
                  >
                    <div className="relative h-64 w-full overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group-hover/item:-translate-y-2 group-hover/item:shadow-[0_20px_50px_rgba(0,53,128,0.1)]">
                      {/* Sub-label background */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1E3A5F]/80 via-[#1E3A5F]/20 to-transparent z-10 transition-opacity duration-500 opacity-60 group-hover/item:opacity-90" />

                      <Image
                        src={getImageUrl(item.featuredImage)}
                        width={600}
                        height={800}
                        alt={`${item.title} accommodations`}
                        className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover/item:scale-110"
                        priority={index < 4}
                      />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-end z-20">
                        <div className="translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                          <span className="inline-block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">
                            Explore Stays
                          </span>
                          <h3 className="text-white font-bold text-xl leading-tight">
                            {item.title}
                          </h3>
                        </div>
                        
                        {/* Decorative line */}
                        <div className="w-0 group-hover/item:w-12 h-1 bg-amber-400 rounded-full mt-3 transition-all duration-500 delay-100" />
                      </div>

                      {/* Floating Icon (Glassmorphism) */}
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-500 scale-75 group-hover/item:scale-100 z-30">
                         <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                         </svg>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom Arrow Positioning */}
            <div className="absolute -top-16 right-0 flex items-center gap-2">
               <CarouselPrevious className="static translate-y-0 h-10 w-10 bg-white border-gray-100 shadow-sm hover:bg-[#1E3A5F] hover:text-white transition-all" />
               <CarouselNext className="static translate-y-0 h-10 w-10 bg-white border-gray-100 shadow-sm hover:bg-[#1E3A5F] hover:text-white transition-all" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
