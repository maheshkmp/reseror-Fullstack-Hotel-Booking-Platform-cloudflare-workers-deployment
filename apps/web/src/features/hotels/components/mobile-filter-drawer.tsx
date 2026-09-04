"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, Map as MapIcon, List as ListIcon } from "lucide-react";
import { SearchFilters } from "./search-filters";
import { useState } from "react";
import { useQueryState, parseAsString } from "nuqs";

interface MobileFilterDrawerProps {
  filterProps: any; // We'll pass the same props as SearchFilters
}

export function MobileFilterDrawer({ filterProps }: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault("list").withOptions({ shallow: false })
  );

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] lg:hidden">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-2 py-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              className="rounded-full h-11 px-6 font-black text-[13px] uppercase tracking-wider text-gray-900 hover:bg-gray-50 gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#004BD7]" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-[32px] overflow-hidden border-none">
            <SheetHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
              <SheetTitle className="text-xl font-black text-gray-900">Filters</SheetTitle>
              <button 
                onClick={() => setOpen(false)}
                className="text-[11px] font-black text-[#004BD7] uppercase tracking-widest"
              >
                Show Results
              </button>
            </SheetHeader>
            <div className="overflow-y-auto h-full pb-32">
              <SearchFilters {...filterProps} />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="w-[1px] h-6 bg-gray-200" />

        <Button 
          variant="ghost" 
          className="rounded-full h-11 px-6 font-black text-[13px] uppercase tracking-wider text-gray-900 hover:bg-gray-50 gap-2"
          onClick={() => {
            setView(view === "map" ? "list" : "map");
          }}
        >
          {view === "map" ? (
            <>
              <ListIcon className="w-4 h-4 text-[#004BD7]" />
              List
            </>
          ) : (
            <>
              <MapIcon className="w-4 h-4 text-[#004BD7]" />
              Map
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
