"use client";

import { useSearchParams } from "next/navigation";
import { useGetAds } from "../actions/use-get-ad";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { SearchBar } from "./search-bar";
import { columns } from "./ad-table/columns";
import DataTableError from "@/components/table/data-table-error";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
export default function AdList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sort = (searchParams.get("sort") as "asc" | "desc" | undefined) || "desc";
  const ownerType = (searchParams.get("ownerType") as "admin" | "hotel" | undefined) || "all";

  const { data, isLoading, isError, error } = useGetAds({
    page,
    limit,
    search,
    sort,
    ownerType: ownerType === "all" ? undefined : ownerType,
  });

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("ownerType");
    } else {
      params.set("ownerType", value);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={10} />;
  }

  if (isError || !data) {
    return <DataTableError error={error as any} />;
  }

  const ads = Array.isArray(data?.data) ? data.data : [];
  const meta = data?.meta || { totalItems: 0 };

  // Purely client-side filter as requested
  const filteredAds = ads.filter((ad: any) => {
    const role = ad.creatorRole;
    if (ownerType === "admin") {
      return role ? role === "admin" : !ad.hotelId;
    }
    if (ownerType === "hotel") {
      return role ? role !== "admin" : !!ad.hotelId;
    }
    return true;
  });

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/10 p-3 rounded-lg border border-border/40">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <SearchBar />
          <Tabs 
            defaultValue={ownerType} 
            onValueChange={handleTabChange}
            className="block" 
          >
            <TabsList className="bg-background border border-border/60 h-9 p-1">
              <TabsTrigger value="all" className="text-[11px] h-7 px-3">All Assets</TabsTrigger>
              <TabsTrigger value="admin" className="text-[11px] h-7 px-3">Admin</TabsTrigger>
              <TabsTrigger value="hotel" className="text-[11px] h-7 px-3">Hotel Owner</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2 bg-background/50 py-1 rounded border border-border/20">
          {filteredAds.length} items showing
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden bg-background border border-border/40 rounded-md">
        <DataTable
          columns={columns}
          data={filteredAds}
          totalItems={filteredAds.length}
        />
      </div>
    </div>
  );
}
