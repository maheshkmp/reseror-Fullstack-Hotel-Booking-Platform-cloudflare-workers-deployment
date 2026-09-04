"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import type { Amenity } from "core/zod";
import { AmenityIcon } from "@/features/admin/property-attributes-management/components/amenity-icon";
import { InboxIcon } from "lucide-react";

type Props = {
  /** The full pool of global amenities to display */
  pool: Amenity[];
  /** Names of currently selected amenities */
  selectedNames: string[];
  onSelect: Dispatch<SetStateAction<string[]>>;
};

export function AmenitiesPool({ pool, selectedNames, onSelect }: Props) {
  if (!pool.length) {
    return (
      <div className="w-full bg-slate-50/50 rounded-sm p-6 border border-slate-200 border-dashed text-center">
        <InboxIcon className="size-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No amenities found. Ask an admin to add amenities in the Property Attributes panel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/50 rounded-sm p-4 sm:p-6 border border-slate-200 border-dashed">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {pool.map((item) => {
          const isActive = selectedNames.includes(item.name);

          return (
            <Button
              key={item.id}
              type="button"
              onClick={() => {
                if (isActive) {
                  onSelect((prev) => prev.filter((n) => n !== item.name));
                } else {
                  onSelect((prev) => [...prev, item.name]);
                }
              }}
              className={cn(
                "rounded-md h-10 px-4 py-2 transition-all duration-200 text-xs font-bold uppercase tracking-wider",
                isActive
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300"
              )}
              variant={isActive ? "default" : "outline"}
            >
              <AmenityIcon
                icon={item.icon}
                className={cn("w-4 h-4 mr-2", isActive ? "text-white" : "text-slate-400")}
              />
              {item.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
