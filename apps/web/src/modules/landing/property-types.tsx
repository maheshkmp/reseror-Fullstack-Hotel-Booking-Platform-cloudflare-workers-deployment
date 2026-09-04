"use client";

import { useRouter } from "next/navigation";
import { useGetDestinations } from "../../features/admin/destination-management/actions/get-action";

export function PropertyTypes() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetDestinations({
    page: 1,
    limit: 6,
    search: "",
    sort: "desc",
  });

  const handleCardClick = () => {
    router.push("/search");
  };

  const handleViewAllClick = () => {
    router.push("/search");
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto mb-6">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-3xl bg-white"
              >
                <div className="h-56 bg-gray-200 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="h-6 bg-gray-300 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return <div></div>;
  }

  const propertyTypes = data.data.filter(
    (item) => item.category === "Property Type"
  );

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
            Browse by property type
          </h2>

          <p className="text-gray-600 text-sm md:text-base mb-6">
            Find the perfect accommodation that matches your style and budget
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyTypes.map((type, index) => (
            <div
              key={index}
              onClick={handleCardClick}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={type.featuredImage || "https://via.placeholder.com/300"}
                  alt={type.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{type.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleViewAllClick}
            className="bg-gradient-to-r from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View All Property Types
          </button>
        </div>
      </div>
    </section>
  );
}
