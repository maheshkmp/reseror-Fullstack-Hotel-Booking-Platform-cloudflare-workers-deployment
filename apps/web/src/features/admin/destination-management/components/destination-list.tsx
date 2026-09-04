"use client";

import { useSearchParams } from "next/navigation";
import { useGetDestinations } from "../actions/get-action";
import { SearchBar } from "./search-bar";
import { DestinationCard } from "./destination-card";
import { Skeleton } from "@/components/ui/skeleton";
import { InboxIcon } from "lucide-react";

export function DestinationList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  
  const { data, isLoading, isError, error } = useGetDestinations({
    page,
    limit: 10,
    sort: "desc",
    search,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <span className="text-rose-500 font-bold">!</span>
        </div>
        <h3 className="text-lg font-semibold">Failed to fetch destinations</h3>
        <p className="text-sm text-muted-foreground mt-1">There was an error loading the destination data.</p>
      </div>
    );
  }

  const destinations = data.data || [];
  const meta = data.meta || { totalItems: 0 };

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden">
      <div className="flex items-center justify-between gap-4 bg-secondary/20 p-2 rounded-md border border-border/40">
        <SearchBar />
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-2">
          {meta.totalItems || destinations.length} destinations
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
            <div className="size-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <InboxIcon className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No destinations found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              We couldn't find any destinations matching your current filters. Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 px-1 pb-4">
            {destinations.map((destination: any) => (
              <DestinationCard key={destination.id} destination={destination as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
