"use client";

import { useGetHotelTypes } from "../api/use-get-hotel-types";
import { useHotelTypesTableFilters } from "./hotel-types-table/use-hotel-types-table-filters";
import { HotelTypeCard } from "./hotelType-card";
import { Skeleton } from "@/components/ui/skeleton";
import { InboxIcon } from "lucide-react";

export default function PropertyTypesListing() {
  const { page, limit, searchQuery } = useHotelTypesTableFilters();
  const { data, error, isPending } = useGetHotelTypes({
    limit,
    page,
    search: searchQuery,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error || !data || !Array.isArray(data)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <span className="text-rose-500 font-bold">!</span>
        </div>
        <h3 className="text-lg font-semibold">Failed to fetch property types</h3>
        <p className="text-sm text-muted-foreground mt-1">There was an error loading the property type data.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto pb-6">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
          <div className="size-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <InboxIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No property types found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            No property types match your current filters. Try adjusting your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 px-1 pb-4">
          {data.map((item) => (
            <HotelTypeCard key={item.id} hotelType={item} />
          ))}
        </div>
      )}
    </div>
  );
}
