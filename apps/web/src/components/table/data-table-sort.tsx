"use client";

import { Sort } from "@/lib/searchparams";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SortAsc, SortDesc } from "lucide-react";
import { Options } from "nuqs";
import { useTransition } from "react";

interface DataTableSortProps {
  sortValue: Sort;
  setSort: (
    value: Sort | ((old: Sort) => Sort | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setPage: (
    value: number | ((old: number) => number | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
}

/*************  ✨ Command ⭐  *************/
/**
 * A sort toggle button for a DataTable.
 *
 * @remarks
 *
 * This component allows users to toggle the sort order between ascending and descending.
 * It uses the `useTransition` hook from `react` to prevent the component from re-rendering
 * while the sort operation is in progress.
 *
 * The component expects the following props:
 *
 * - `sortValue`: The current sort direction (asc/desc)
 * - `setSort`: A function that sets the sort direction
 * - `setPage`: A function that sets the page number
 *
 * The component returns a Button with an appropriate sort direction icon.
 ***/

export function DataTableSort({
  sortValue,
  setSort,
  setPage
}: DataTableSortProps) {
  const [isLoading, startTransition] = useTransition();

  const handleToggleSort = () => {
    startTransition(() => {
      const newSortValue = sortValue === Sort.asc ? Sort.desc : Sort.asc;
      setSort(newSortValue);
      setPage(1); // Reset page to 1 when sort changes
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleSort}
      className={cn("flex items-center", isLoading && "animate-pulse")}
    >
      {sortValue === Sort.asc ? <SortDesc /> : <SortAsc />}
    </Button>
  );
}
