"use client";

import { useQueryState, parseAsString } from "nuqs";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewToggle() {
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault("list").withOptions({ shallow: false })
  );

  return (
    <div className="flex items-center bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
      <button
        onClick={() => setView("list")}
        className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
          view === "list" 
            ? "bg-[#003580] text-white shadow-md shadow-blue-100" 
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        <List className="w-4 h-4" />
        List
      </button>
      <button
        onClick={() => setView("map")}
        className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
          view === "map" 
            ? "bg-[#003580] text-white shadow-md shadow-blue-100" 
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        <MapIcon className="w-4 h-4" />
        Map
      </button>
    </div>
  );
}
