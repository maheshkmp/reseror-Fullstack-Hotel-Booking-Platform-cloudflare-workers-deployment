"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetHotels } from "../api/use-get-hotels";
import { useGetRestaurants } from "../../../resturant/actions/use-get-restaurant";
import { columns } from "./hotels-table/columns";
import { useHotelsTableFilters } from "./hotels-table/use-hotels-table-filters";
import { BulkActions } from "./hotels-table/bulk-actions";
import { deleteHotel } from "../api/use-delete-hotels";
import { updateHotel } from "../api/use-update-hotels";
import { toast } from "sonner";
import { PropertyStats } from "./property-stats";
import { HotelsTableActions } from "./hotels-table/hotels-table-actions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetHotelTypes } from "@/features/hotels/queries/use-get-hotel-types";
import { useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PropertyCard } from "./property-card";
import { useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { RestaurantList } from "@/features/resturant/components/restaurant-list";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

export default function PropertiesListing() {
  const router = useRouter();
  const { data: hotelTypesData } = useGetHotelTypes();
  const {
    page,
    limit,
    searchQuery,
    hotelType,
    propertyClass,
    status,
    setHotelType,
    setStatus,
    setPage,
    isOverdue,
    setIsOverdue
  } = useHotelsTableFilters();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [view, setView] = useQueryState("view", {
    defaultValue: "list",
    parse: (val) => (val === "grid" ? "grid" : "list"),
    serialize: (val) => val,
    shallow: false,
  });

  const tabValue = isOverdue === "true"
    ? "overdue"
    : status === "pending_approval"
      ? "pending"
      : hotelType === "restaurants"
        ? "restaurants"
        : hotelType
          ? hotelTypesData?.find((t: any) => t.id === hotelType)?.name.toLowerCase() || "all"
          : "all";

  const { data: hotelsData, error: hotelsError, isPending: isHotelsPending } = useGetHotels({
    limit,
    page,
    search: searchQuery,
    hotelType,
    propertyClass,
    status,
  });

  const { data: restaurantsData, isPending: isRestaurantsPending } = useGetRestaurants({
    limit,
    page,
    search: searchQuery,
    status,
  }, {
    enabled: tabValue === "all" || tabValue === "restaurants" || tabValue === "restaurant"
  });

  const combinedData = useMemo(() => {
    const hotels = hotelsData?.data || [];

    // Only include restaurants if we are on 'All' or 'Restaurants' tabs
    if (tabValue !== "all" && tabValue !== "restaurants" && tabValue !== "restaurant") {
      return hotels;
    }

    const mappedRestaurants = (restaurantsData?.data || []).map((r: any) => ({
      ...r,
      isRestaurant: true,
      hotelType: { name: "Restaurant" },
      propertyClass: { name: "N/A" },
      performance: {
        totalRooms: r.totalSeats || 0, // Map seats to rooms for inventory display
        totalBookings: 0,
        totalRevenue: 0,
        isOverdue: false
      },
      roomTypes: []
    }));

    // If we are on 'Restaurants' tab, only show restaurants
    if (tabValue === "restaurants" || tabValue === "restaurant") {
      return mappedRestaurants;
    }

    // On 'All' tab, mix them
    return [...hotels, ...mappedRestaurants].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [hotelsData, restaurantsData, tabValue]);

  const totalCount = useMemo(() => {
    const hotelCount = hotelsData?.meta?.totalCount || 0;
    const restaurantCount = (tabValue === "all" || tabValue === "restaurants" || tabValue === "restaurant")
      ? (restaurantsData?.meta?.totalCount || 0)
      : 0;

    if (tabValue === "restaurants" || tabValue === "restaurant") return restaurantCount;
    if (tabValue === "all") return hotelCount + restaurantCount;
    return hotelCount;
  }, [hotelsData, restaurantsData, tabValue]);

  const isPending = isHotelsPending || (isRestaurantsPending && (tabValue === "all" || tabValue === "restaurants" || tabValue === "restaurant"));
  const error = hotelsError;
  const totalPages = Math.ceil(totalCount / limit);
  const data: { data: any[]; meta: { totalCount: number; totalPages: number } } = {
    data: combinedData,
    meta: { totalCount, totalPages }
  };

  const selectedIds = Object.keys(rowSelection);

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} properties?`
      )
    ) {
      try {
        await Promise.all(selectedIds.map((id) => deleteHotel(id)));
        setRowSelection({});
        toast.success(`${selectedIds.length} properties deleted successfully`);
      } catch (err) {
        toast.error("Failed to delete some properties");
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await Promise.all(
        selectedIds.map((id) => updateHotel(id, { status: newStatus as any }))
      );
      setRowSelection({});
      toast.success(`Status updated for ${selectedIds.length} properties`);
    } catch (err) {
      toast.error("Failed to update status for some properties");
    }
  };

  if (isPending && tabValue !== "restaurants" && tabValue !== "restaurant") {
    return <DataTableSkeleton columnCount={columns.length} rowCount={4} />;
  }

  if (tabValue !== "restaurants" && tabValue !== "restaurant" && (!data || error)) {
    return <DataTableError error={error} />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-0">
      <PropertyStats hotels={data?.data as any || []} isLoading={isPending} />

      <div className="flex flex-1 flex-col gap-3 min-h-0 bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 pt-4 flex flex-col gap-4">
          <Tabs
            value={tabValue}
            onValueChange={(val) => {
              if (val === "all") {
                setHotelType(null);
                setStatus(null);
                setIsOverdue(null);
              } else if (val === "pending") {
                setHotelType(null);
                setStatus("pending_approval");
                setIsOverdue(null);
              } else if (val === "overdue") {
                setHotelType(null);
                setStatus(null);
                setIsOverdue("true");
              } else if (val === "restaurants") {
                setStatus(null);
                setIsOverdue(null);
                const type = hotelTypesData?.find((t: any) =>
                  t.name.toLowerCase().includes("restaurant")
                );
                setHotelType(type?.id || "restaurants");
              } else {
                setStatus(null);
                setIsOverdue(null);
                const searchVal = val.toLowerCase();
                const type = hotelTypesData?.find((t: any) => {
                  const typeName = t.name.toLowerCase();
                  return typeName === searchVal ||
                    typeName === searchVal.replace(/s$/, "") ||
                    searchVal === typeName.replace(/s$/, "");
                });
                if (type) setHotelType(type.id);
              }
              setPage(1);
            }}
            className="w-full"
          >
            <TabsList className="bg-slate-100/50 p-1 h-11">
              <TabsTrigger value="all" className="px-6 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="pending" className="px-6 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                Pending
                {tabValue !== "restaurants" && data?.data?.filter((p: any) => p.status === "pending_approval").length > 0 && (
                  <Badge className="h-4 px-1 min-w-[16px] bg-amber-500 text-white border-none text-[10px]">
                    {data.data.filter((p: any) => p.status === "pending_approval").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="hotels" className="px-6 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Hotels</TabsTrigger>
              <TabsTrigger value="villas" className="px-6 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Villas</TabsTrigger>
              <TabsTrigger value="restaurants" className="px-6 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Restaurants</TabsTrigger>
              <TabsTrigger value="overdue" className="px-6 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 text-rose-600 data-[state=active]:text-rose-700 font-bold">
                Overdue
                {tabValue !== "restaurants" && data?.data?.filter((p: any) => p.performance?.isOverdue).length > 0 && (
                  <Badge className="h-4 px-1 min-w-[16px] bg-rose-500 text-white border-none text-[10px]">
                    {data.data.filter((p: any) => p.performance?.isOverdue).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center justify-between">
            <HotelsTableActions />

            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(val) => val && setView(val as any)}
              className="border rounded-lg p-0.5 bg-slate-100/50"
            >
              <ToggleGroupItem value="list" className="h-8 px-2.5 data-[state=on]:bg-white data-[state=on]:shadow-sm" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" className="h-8 px-2.5 data-[state=on]:bg-white data-[state=on]:shadow-sm" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="px-4">
          <BulkActions
            selectedCount={selectedIds.length}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </div>

        <div className="px-4 pb-4 flex-1 overflow-y-auto">
          {view === "list" ? (
            <DataTable
              columns={columns}
              data={data?.data as any || []}
              totalItems={data?.meta?.totalCount || data?.data?.length || 0}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              getRowId={(row: any) => row.id}
              onRowClick={(row: any) => {
                if (row.isRestaurant) {
                  router.push(`/admin/restaurants/${row.id}`);
                } else {
                  router.push(`/admin/properties/${row.id}/setup`);
                }
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {(data?.data as any[] || []).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Grid view pagination */}
              <div className="flex items-center justify-between py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data?.meta?.totalCount || 0)} of {data?.meta?.totalCount || 0} properties
                </p>
                <Pagination className="w-auto mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                        aria-disabled={page <= 1}
                        className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      const pageNum = i + 1; // Simplistic pagination for now
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNum);
                            }}
                            isActive={page === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage(page + 1);
                        }}
                        aria-disabled={page >= totalPages}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
