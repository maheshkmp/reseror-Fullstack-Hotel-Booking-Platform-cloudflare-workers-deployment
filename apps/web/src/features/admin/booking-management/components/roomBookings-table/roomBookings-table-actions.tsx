"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import { useRoomBookingsTableFilters } from "./use-roomBookings-table-filters";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { useGetHotels } from "@/features/admin/property-management/api/use-get-hotels";
import { Filter } from "lucide-react";

export function RoomBookingsTableActions() {
  const {
    searchQuery,
    setSearchQuery,
    setPage,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    paymentMethod,
    setPaymentMethod,
    hotelId,
    setHotelId,
    from,
    setFrom,
    to,
    setTo,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    resetFilters,
    isAnyFilterActive
  } = useRoomBookingsTableFilters();

  const { data: hotelsData } = useGetHotels({ limit: 100 });
  const hotelsOptions = (hotelsData?.data || []).map((h: any) => ({
    label: h.name,
    value: h.id,
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px]">
          <DataTableSearch
            searchKey="guest name"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NativeSelect
            value={status || ""}
            onChange={(e) => {
              setStatus(e.target.value || null);
              setPage(1);
            }}
            options={[
              { label: "All Statuses", value: "" },
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Cancelled", value: "cancelled" },
              { label: "Checked In", value: "checked_in" },
              { label: "Checked Out", value: "checked_out" },
              { label: "No Show", value: "no_show" },
            ]}
            className="w-[140px] h-9 text-xs"
          />

          <NativeSelect
            value={paymentStatus || ""}
            onChange={(e) => {
              setPaymentStatus(e.target.value || null);
              setPage(1);
            }}
            options={[
              { label: "All Payments", value: "" },
              { label: "Paid", value: "true" },
              { label: "Pending", value: "false" },
            ]}
            className="w-[140px] h-9 text-xs"
          />

          <NativeSelect
            value={hotelId || ""}
            onChange={(e) => {
              setHotelId(e.target.value || null);
              setPage(1);
            }}
            options={[
              { label: "All Hotels", value: "" },
              ...hotelsOptions
            ]}
            className="w-[180px] h-9 text-xs"
          />

          <DataTableResetFilter
            isFilterActive={isAnyFilterActive}
            onReset={resetFilters}
          />
        </div>
      </div>
      
      {/* Advanced Filters Row */}
      <div className="flex flex-wrap items-end gap-3 p-3 bg-background rounded border border-border/50">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mr-2">
          <Filter className="w-3.5 h-3.5" />
          More Filters:
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-muted-foreground ml-1">Date Range</label>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={from || ""}
              onChange={(e) => {
                setFrom(e.target.value || null);
                setPage(1);
              }}
              className="w-[130px] h-8 text-xs"
            />
            <span className="text-muted-foreground/50">-</span>
            <Input
              type="date"
              value={to || ""}
              onChange={(e) => {
                setTo(e.target.value || null);
                setPage(1);
              }}
              className="w-[130px] h-8 text-xs"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-muted-foreground ml-1">Amount Range (USD)</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minAmount || ""}
              onChange={(e) => {
                setMinAmount(e.target.value || null);
                setPage(1);
              }}
              className="w-[90px] h-8 text-xs"
            />
            <span className="text-muted-foreground/50">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxAmount || ""}
              onChange={(e) => {
                setMaxAmount(e.target.value || null);
                setPage(1);
              }}
              className="w-[90px] h-8 text-xs"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 ml-auto">
          <label className="text-[10px] font-medium text-muted-foreground ml-1">Payment Method</label>
          <NativeSelect
            value={paymentMethod || ""}
            onChange={(e) => {
              setPaymentMethod(e.target.value || null);
              setPage(1);
            }}
            options={[
              { label: "Any Method", value: "" },
              { label: "Online", value: "online" },
              { label: "Cash", value: "cash" },
            ]}
            className="w-[120px] h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
