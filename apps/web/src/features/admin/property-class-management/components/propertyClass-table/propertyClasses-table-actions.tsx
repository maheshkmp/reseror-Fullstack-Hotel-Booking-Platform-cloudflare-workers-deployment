"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import PropertyClassesForm from "../propertyClasses-form";
import { usePropertyClassTableFilters } from "./use-propertyClasses-table-filters";

type Props = {};

export function PropertyClassTableActions({}: Props) {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive,
  } = usePropertyClassTableFilters();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex-1 flex items-center gap-2">
        {/* <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        /> */}
        <PropertyClassesForm />
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
