import { transformDatesRecursive } from "@/features/hotels/utils/transforms";
import { getClient } from "@/lib/rpc/server";
import Image from "next/image";
import Link from "next/link";

type Props = {};

export async function PropertyClasses({}: Props) {
  const rpcClient = await getClient();

  const propertyClassesRes = await rpcClient.api["property-classes"].$get({
    query: {
      page: "1",
      limit: "10",
    },
  });

  if (!propertyClassesRes.ok) {
    return <></>;
  }

  const apiResponse = await propertyClassesRes.json();
  // Use the more specific transformation for consistent Date handling
  const propertyClasses = transformDatesRecursive(apiResponse);

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
          Browse by Property Class
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Find your perfect stay from economy to luxury accommodations
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {propertyClasses.map((propertyClass) => (
          <Link
            href={`/search?propertyClass=${propertyClass.id}`}
            key={propertyClass.id}
            className="block transition-transform hover:scale-[1.02]"
          >
            <div className="relative h-48 md:h-56 w-full rounded-lg overflow-hidden shadow-md group">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10" />

              {/* Image */}
              <Image
                src={propertyClass.thumbnail || ""}
                width={600}
                height={400}
                alt={`${propertyClass.name} accommodations`}
                className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />

              {/* Content */}
              <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
                <h3 className="text-white font-semibold text-xl md:text-2xl drop-shadow-sm">
                  {propertyClass.name}
                </h3>
                <div>
                  <span className="inline-block px-3 py-1 bg-[#003580]/80 text-white text-sm rounded-full">
                    Browse options
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
