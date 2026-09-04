"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import { HotelTypesDropdown } from "@/features/hotels/components/hotel-types-dropdown";
import { PropertyClassDropdown } from "@/features/hotels/components/property-class-dropdown";
import { HotelStatusFilter } from "../hotel-status-filter";
import { useHotelsTableFilters } from "./use-hotels-table-filters";

type Props = {};

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FilterIcon, 
  SearchIcon, 
  Star, 
  RotateCcw,
  Check,
  ChevronDown
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ImportDialog } from "@/components/admin/import-dialog";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
// import { authHeaders } from "core/auth/client"; // Removed invalid import

export function HotelsTableActions({ }: Props) {
  const {
    searchQuery,
    setSearchQuery,
    hotelType,
    setHotelType,
    propertyClass,
    setPropertyClass,
    status,
    setStatus,
    starRating,
    setStarRating,
    setPage,
    resetFilters,
    isAnyFilterActive
  } = useHotelsTableFilters();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
        <Input
          placeholder="Search name or ID..."
          value={searchQuery ?? ""}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="h-10 pl-9 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-1"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-10 px-4 rounded-xl border-slate-200 bg-white shadow-sm text-xs font-bold gap-2 transition-all",
                isAnyFilterActive && "border-indigo-200 bg-indigo-50/30 text-indigo-600"
              )}
            >
              <FilterIcon className="size-3.5" />
              Filters
              {isAnyFilterActive && (
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center bg-indigo-100 text-indigo-700 border-none text-[10px]">
                  +
                </Badge>
              )}
              <ChevronDown className="size-3 opacity-50 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 rounded-2xl shadow-xl border-slate-200 overflow-hidden" align="end">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">Advanced Filters</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-[10px] font-bold text-slate-500 hover:text-indigo-600"
                onClick={resetFilters}
                disabled={!isAnyFilterActive}
              >
                <RotateCcw className="size-3 mr-1" />
                Reset
              </Button>
            </div>
            
            <div className="p-4 space-y-5">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Property Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {["active", "pending_approval", "inactive", "under_maintenance"].map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8 justify-start px-2 rounded-lg text-[11px] font-medium border-slate-200",
                        status === s && "border-indigo-600 bg-indigo-50 text-indigo-700"
                      )}
                      onClick={() => setStatus(status === s ? null : s)}
                    >
                      <div className={cn(
                        "size-1.5 rounded-full mr-2",
                        s === "active" ? "bg-emerald-500" : 
                        s === "pending_approval" ? "bg-amber-500" : 
                        s === "inactive" ? "bg-slate-400" : "bg-rose-500"
                      )} />
                      {s.replace("_", " ")}
                      {status === s && <Check className="ml-auto size-3" />}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Property Class & Type */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Property Class</label>
                  <PropertyClassDropdown
                    showHintText={false}
                    className="h-9 w-full rounded-lg border-slate-200 bg-white shadow-sm text-xs"
                    onSelect={(pc) => setPropertyClass(pc?.id || null)}
                  />
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Star Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="outline"
                      size="icon"
                      className={cn(
                        "size-9 rounded-lg border-slate-200",
                        starRating === rating.toString() && "border-indigo-600 bg-indigo-50 text-indigo-700"
                      )}
                      onClick={() => setStarRating(starRating === rating.toString() ? null : rating.toString())}
                    >
                      <Star className={cn(
                        "size-4",
                        starRating === rating.toString() ? "fill-indigo-600" : "text-slate-400"
                      )} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-100">
              <Button 
                className="w-full h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                onClick={() => {}} // Popover closes automatically on focus change, or we can use a state
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {isAnyFilterActive && (
          <Button
            variant="ghost"
            className="h-10 px-2 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            onClick={resetFilters}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4 rounded-xl border-slate-200 bg-white shadow-sm text-xs font-bold gap-2 hover:bg-slate-50"
          onClick={async () => {
            try {
              const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/export`);
              if (searchQuery) url.searchParams.append("search", searchQuery);
              
              const response = await fetch(url.toString(), {
                credentials: "include",
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                console.error(`Export failed with status ${response.status}:`, errorText);
                throw new Error(`Failed to export: ${response.status}`);
              }
              
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.setAttribute("download", `properties_${new Date().toISOString().split('T')[0]}.xlsx`);
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (error) {
              console.error("Export error:", error);
              toast.error("Failed to export properties");
            }
          }}
        >
          <Download className="size-3.5" />
          Export
        </Button>

        <ImportDialog
          title="Import Properties"
          description="Upload an Excel file to bulk create or update properties. Matching IDs will be updated."
          onDownloadTemplate={async () => {
             try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/template`, {
                  credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to download template");
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "property_import_template.xlsx");
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (error) {
                toast.error("Failed to download template");
              }
          }}
          onImport={async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/import`, {
              method: "POST",
              credentials: "include",
              body: formData,
            });
            
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || "Failed to import");
            }
            
            return response.json();
          }}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 rounded-xl border-slate-200 bg-white shadow-sm text-xs font-bold gap-2 hover:bg-slate-50"
            >
              <Upload className="size-3.5" />
              Import
            </Button>
          }
        />
      </div>
    </div>
  );
}
