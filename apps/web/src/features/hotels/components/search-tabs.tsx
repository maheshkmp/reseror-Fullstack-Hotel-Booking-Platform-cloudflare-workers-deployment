"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Hotel as HotelIcon, 
  Home, 
  Utensils, 
  Bed, 
  LayoutGrid 
} from "lucide-react";

const TAB_CATEGORIES = [
  { label: "All stays", value: "", icon: LayoutGrid },
  { label: "Hotels", value: "hotel", icon: HotelIcon },
  { label: "Rooms", value: "room", icon: Bed },
  { label: "Villas", value: "villa", icon: Home },
  { label: "Apartments", value: "apartment", icon: Building2 },
  { label: "Restaurants", value: "restaurant", icon: Utensils },
];

export function SearchTabs({ hotelTypes = [] }: { hotelTypes?: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentHotelType = searchParams.get("hotelType") || "";

  const handleTabClick = (label: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (label === "All stays") {
      params.delete("hotelType");
    } else {
      // Find the actual ID from hotelTypes if available
      const type = hotelTypes.find(t => t.name.toLowerCase() === label.toLowerCase().replace(/s$/, ''));
      if (type) {
        params.set("hotelType", type.id);
      } else {
        // Fallback to label if no ID found (might work if API supports name filtering)
        params.set("hotelType", label.toLowerCase().replace(/s$/, ''));
      }
    }
    
    // Reset page to 1 when changing tabs
    params.set("page", "1");
    startTransition(() => {
      router.push(`/search?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="w-full bg-white overflow-hidden rounded-xl border border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide no-scrollbar py-2">
          {TAB_CATEGORIES.map((tab) => {
            const Icon = tab.icon;
            // Check if tab is active by comparing label/value
            // This is tricky because we use IDs. We'll check if the current hotelType matches the expected type
            const isAllStays = tab.label === "All stays" && currentHotelType === "";
            const matchedType = hotelTypes.find(t => t.id === currentHotelType);
            const isMatched = matchedType && (matchedType.name.toLowerCase() === tab.label.toLowerCase().replace(/s$/, ''));
            const isFallbackMatched = currentHotelType === tab.label.toLowerCase().replace(/s$/, '');
            
            const isActive = isAllStays || isMatched || isFallbackMatched;

            return (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.label)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all relative whitespace-nowrap",
                  isActive 
                    ? "text-[#004BD7]" 
                    : "text-gray-500 hover:text-[#004BD7] hover:bg-blue-50/50 rounded-lg"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-[#004BD7]" : "text-gray-400")} />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#004BD7] rounded-full mx-4" />
                )}
                {isActive && isPending && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
