"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import { useHotelTypesTableFilters } from "@/features/admin/property-type-management/components/hotel-types-table/use-hotel-types-table-filters";
import HotelTypesForm from "../hotel-types-form";

type Props = {};

export function PropertyTypesTableActions({}: Props) {
  const {
    //Search
    searchQuery,
    setSearchQuery,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive,
  } = useHotelTypesTableFilters();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex-1 flex items-center gap-2">
        {/* <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        /> */}
        <HotelTypesForm />
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
