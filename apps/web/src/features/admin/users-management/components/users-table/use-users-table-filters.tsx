"use client";

import { useCallback, useMemo } from "react";
import { useQueryState } from "nuqs";

import { searchParams } from "@/lib/searchparams";

export function useUsersTableFilters() {
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

  const [tab, setTab] = useQueryState(
    "tab",
    searchParams.tab.withDefault("all")
  );

  const [status, setStatus] = useQueryState(
    "status",
    searchParams.status.withDefault("")
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatus(null);

    setPage(1);
    setLimit(10);
  }, [setSearchQuery, setStatus, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!status;
  }, [searchQuery, status]);

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    page,
    setPage,
    limit,
    setLimit,

    // Tabs
    tab,
    setTab,

    // Status
    status,
    setStatus,

    // Reset
    resetFilters,
    isAnyFilterActive,
  };
}
