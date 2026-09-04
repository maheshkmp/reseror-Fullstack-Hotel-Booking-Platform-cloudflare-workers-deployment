"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import { useRoomBookingsTableFilters } from "./use-userPayment-table-filters";

type Props = {};

export function RoomBookingsTableActions({}: Props) {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive,
  } = useRoomBookingsTableFilters();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex-1">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
    </div>
  );
}
