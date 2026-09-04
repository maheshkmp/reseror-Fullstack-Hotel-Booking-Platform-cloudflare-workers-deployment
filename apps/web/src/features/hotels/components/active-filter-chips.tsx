"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function ActiveFilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const removeFilter = useCallback((key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      // For comma-separated lists (like roomTypes, facilities)
      const currentValues = params.get(key)?.split(",") || [];
      const newValues = currentValues.filter(v => v !== value);
      if (newValues.length > 0) {
        params.set(key, newValues.join(","));
      } else {
        params.delete(key);
      }
    } else {
      params.delete(key);
    }
    
    router.push(`/search?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const activeChips = useMemo(() => {
    const chips: { key: string; value?: string; label: string }[] = [];

    // Search query
    const search = searchParams.get("search");
    if (search) chips.push({ key: "search", label: `Search: ${search}` });

    // Price
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      chips.push({ 
        key: "price", 
        label: `Price: $${minPrice || 0} - $${maxPrice || "Max"}` 
      });
    }

    // Stars
    const stars = searchParams.get("stars");
    if (stars) {
      stars.split(",").forEach(s => {
        chips.push({ key: "stars", value: s, label: `${s} Stars` });
      });
    }

    // Review Score
    const reviewScore = searchParams.get("reviewScore");
    if (reviewScore) {
      const labels: Record<string, string> = { "9": "9+", "8": "8+", "7": "7+", "6": "6+" };
      chips.push({ key: "reviewScore", label: `Rating: ${labels[reviewScore] || reviewScore}` });
    }

    // Comma-separated lists
    ["brandName", "facilities", "tags", "viewTypes", "roomTypes"].forEach(key => {
      const val = searchParams.get(key);
      if (val) {
        val.split(",").forEach(v => {
          chips.push({ key, value: v, label: v.charAt(0).toUpperCase() + v.slice(1).replace("_", " ") });
        });
      }
    });

    return chips;
  }, [searchParams]);

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active filters:</span>
      {activeChips.map((chip, idx) => (
        <Badge
          key={`${chip.key}-${chip.value || idx}`}
          variant="secondary"
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 pl-2.5 pr-1 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm group"
        >
          {chip.label}
          <button
            onClick={() => {
              if (chip.key === "price") {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("minPrice");
                params.delete("maxPrice");
                router.push(`/search?${params.toString()}`, { scroll: false });
              } else {
                removeFilter(chip.key, chip.value);
              }
            }}
            className="hover:bg-gray-200 rounded-full p-0.5 transition-colors group-hover:text-red-500"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <button
        onClick={() => router.push("/search")}
        className="text-[10px] font-black text-[#004BD7] uppercase tracking-widest hover:underline px-2"
      >
        Clear all
      </button>
    </div>
  );
}
