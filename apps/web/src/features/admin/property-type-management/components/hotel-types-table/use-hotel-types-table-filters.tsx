"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

import { searchParams } from "@/lib/searchparams";

export function useHotelTypesTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [limit, setLimit] = useQueryState(
    "limit",
    searchParams.limit.withDefault(10)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);

    setPage(1);
    setLimit(10);
  }, [setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || page > 1 || limit !== 10;
  }, [searchQuery]);

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    page,
    setPage,
    limit,
    setLimit,

    // Reset
    resetFilters,
    isAnyFilterActive,
  };
}
