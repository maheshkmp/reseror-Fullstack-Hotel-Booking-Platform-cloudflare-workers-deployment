"use client";

import { HotelSelectType } from "@/features/admin/property-management/schemas";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { HotelCard } from "./hotel-card";

type SearchResultsProps = {
  hotels: HotelSelectType[];
  isLoading?: boolean;
};

export function SearchResults({
  hotels,
  isLoading = false
}: SearchResultsProps) {
  // Animation for results appearance
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl border border-gray-100 p-5 h-auto md:h-64 animate-pulse">
              <Skeleton className="w-full md:w-[280px] lg:w-[320px] h-48 md:h-full rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col py-2 justify-between">
                <div className="space-y-4">
                  <Skeleton className="w-1/4 h-3 rounded" />
                  <Skeleton className="w-3/4 h-8 rounded-lg" />
                  <Skeleton className="w-1/2 h-4 rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-5 rounded" />
                    <Skeleton className="w-20 h-5 rounded" />
                  </div>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <Skeleton className="w-32 h-10 rounded-lg" />
                  <Skeleton className="w-40 h-14 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="space-y-6">
        {hotels.map((hotel, index) => (
          <div
            key={hotel.id}
            className={cn(
              "transition-all duration-500 ease-out",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
          >
            <HotelCard
              hotel={hotel as any}
              className="w-full"
              layout="list"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
