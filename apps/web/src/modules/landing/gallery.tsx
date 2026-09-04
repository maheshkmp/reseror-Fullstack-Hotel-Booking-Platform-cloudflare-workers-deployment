// "use client";

// import { useGetAllHotelImages } from "@/features/hotels/queries/use-get-all-hotel-images";
// import { Loader2 } from "lucide-react";
// import Image from "next/image";

// export function HotelImageGallery() {
//   const { data: images, isLoading, error } = useGetAllHotelImages();

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500">
//         Failed to load hotel images. Please try again later.
//       </div>
//     );
//   }

//   if (!images || images.length === 0) {
//     return (
//       <div className="text-center text-gray-500">
//         No images available for the hotels.
//       </div>
//     );
//   }

//   return (
//     <div className="py-12 px-4 md:px-6 lg:px-8 bg-white">
//       <div className="max-w-5xl mx-auto mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
//           Hottest Destinations
//         </h2>

//         <p className="text-gray-600 text-sm md:text-base mb-6">
//           most popular choices from sri lanka
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//         {images.map((image) => (
//           <div
//             key={image.id}
//             className="relative w-full h-48 overflow-hidden rounded-lg shadow"
//           >
//             <Image
//               src={image.imageUrl}
//               alt={image.altText || "Hotel Image"}
//               fill
//               className="object-cover"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useGetAllHotelImages } from "@/features/hotels/queries/use-get-all-hotel-images";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export function HotelImageGallery() {
  const { data: images, isLoading, error } = useGetAllHotelImages();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load hotel images. Please try again later.
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No images available for the hotels.
      </div>
    );
  }

  const destinations = [
    {
      name: "Ella",
      properties: "2,459 properties",
      image: images[0]?.imageUrl || "/ella-sri-lanka.jpg",
    },
    {
      name: "Galle",
      properties: "3,425 properties",
      image: images[1]?.imageUrl || "/galle-sri-lanka.jpg",
    },
    {
      name: "Negombo",
      properties: "2,346 properties",
      image: images[2]?.imageUrl || "/negombo-beach-sri-lanka.jpg",
    },
    {
      name: "Colombo",
      properties: "5,433 properties",
      image: images[3]?.imageUrl || "/colombo-city-sri-lanka.jpg",
    },
    {
      name: "Kandy",
      properties: "2,483 properties",
      image: images[4]?.imageUrl || "/kandy-temple-sri-lanka.jpg",
    },
    {
      name: "Nuwara Eliya",
      properties: "3,533 properties",
      image:
        images[5]?.imageUrl || "/nuwara-eliya-tea-plantation-sri-lanka.jpg",
    },
  ];

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hottest Destinations
            </h2>
            <p className="text-gray-600">Most popular choices from Sri Lanka</p>
          </div>
          <button className="text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-4 py-2 rounded-lg transition-colors">
            See all
          </button>
        </div>

        <div className="grid grid-cols-12 grid-rows-4 gap-4 h-[600px]">
          {/* Ella - Large card (left side) */}
          <div className="col-span-3 row-span-4">
            <div className="relative h-full overflow-hidden rounded-xl group cursor-pointer">
              <Image
                src={destinations[0].image || "/placeholder.svg"}
                alt={destinations[0].name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">
                  {destinations[0].name}
                </h3>
                <p className="text-sm opacity-90">
                  {destinations[0].properties}
                </p>
              </div>
            </div>
          </div>

          {/* Galle - Medium card (top middle) */}
          <div className="col-span-3 row-span-2">
            <div className="relative h-full overflow-hidden rounded-xl group cursor-pointer">
              <Image
                src={destinations[1].image || "/placeholder.svg"}
                alt={destinations[1].name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">
                  {destinations[1].name}
                </h3>
                <p className="text-sm opacity-90">
                  {destinations[1].properties}
                </p>
              </div>
            </div>
          </div>

          {/* Colombo - Medium card (top right) */}
          <div className="col-span-3 row-span-2">
            <div className="relative h-full overflow-hidden rounded-xl group cursor-pointer">
              <Image
                src={destinations[3].image || "/placeholder.svg"}
                alt={destinations[3].name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">
                  {destinations[3].name}
                </h3>
                <p className="text-sm opacity-90">
                  {destinations[3].properties}
                </p>
              </div>
            </div>
          </div>

          {/* Nuwara Eliya - Medium card (far right) */}
          <div className="col-span-3 row-span-2">
            <div className="relative h-full overflow-hidden rounded-xl group cursor-pointer">
              <Image
                src={destinations[5].image || "/placeholder.svg"}
                alt={destinations[5].name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">
                  {destinations[5].name}
                </h3>
                <p className="text-sm opacity-90">
                  {destinations[5].properties}
                </p>
              </div>
            </div>
          </div>

          {/* Negombo - Tall card (bottom middle) */}
          <div className="col-span-3 row-span-2">
            <div className="relative h-full overflow-hidden rounded-xl group cursor-pointer">
              <Image
                src={destinations[2].image || "/placeholder.svg"}
                alt={destinations[2].name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">
                  {destinations[2].name}
                </h3>
                <p className="text-sm opacity-90">
                  {destinations[2].properties}
                </p>
              </div>
            </div>
          </div>

          {/* Kandy - Tall card (bottom right) */}
          <div className="col-span-6 row-span-2">
            <div className="relative h-full overflow-hidden rounded-xl group cursor-pointer">
              <Image
                src={destinations[4].image || "/placeholder.svg"}
                alt={destinations[4].name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">
                  {destinations[4].name}
                </h3>
                <p className="text-sm opacity-90">
                  {destinations[4].properties}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
