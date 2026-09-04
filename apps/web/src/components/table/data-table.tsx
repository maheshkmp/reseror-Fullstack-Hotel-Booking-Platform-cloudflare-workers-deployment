"use client";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];
  rowSelection?: Record<string, boolean>;
  setRowSelection?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50],
  rowSelection = {},
  setRowSelection,
  getRowId,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger
      .withOptions({ shallow: false, history: "push" })
      .withDefault(10)
  );

  const paginationState = {
    pageIndex: currentPage - 1, // zero-based index for React Table
    pageSize: pageSize,
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === "function"
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    setCurrentPage(pagination.pageIndex + 1); // converting zero-based index to one-based
    setPageSize(pagination.pageSize);
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: paginationState,
      rowSelection,
    },
    initialState: {
      columnPinning: {
        left: ["select", "name", "id", "title"],
        right: ["actions"],
      },
    },
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: setRowSelection,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  return (
    <div className="flex flex-col space-y-4 h-full w-full overflow-hidden">
      <div className="relative border rounded-md bg-background overflow-hidden w-full">
        <ScrollArea className="h-[calc(100vh-220px)] relative w-full">
          <Table className="relative min-w-max">
            <TableHeader className="table-sticky-header top-0 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-0">
                  {headerGroup.headers.map((header) => {
                    const isPinned = header.column.getIsPinned();
                    return (
                      <TableHead
                        key={header.id}
                        className={`h-9 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/95 backdrop-blur-sm
                          ${isPinned ? "sticky z-20 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]" : ""}
                          ${isPinned === "left" ? "left-0 border-r border-border/50" : ""}
                          ${isPinned === "right" ? "right-0 border-l border-border/50" : ""}
                        `}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length > 0
                ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    tabIndex={0}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "group border-b border-border/40 hover:bg-accent/40 transition-colors focus-visible:outline-none focus-visible:bg-accent/40 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isPinned = cell.column.getIsPinned();
                      return (
                        <TableCell
                          key={cell.id}
                          className={`py-2 px-3 bg-background group-hover:bg-accent/40 transition-colors
                            ${isPinned ? "sticky z-10" : ""}
                            ${isPinned === "left" ? "left-0 border-r border-border/50" : ""}
                            ${isPinned === "right" ? "right-0 border-l border-border/50" : ""}
                          `}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
                : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex flex-col items-center justify-end gap-4 py-4 sm:flex-row sm:gap-2">
        <div className="flex w-full items-center justify-between sm:justify-start">
          <div className="flex-1 text-sm text-muted-foreground">
            {totalItems > 0 ? (
              <>
                Showing{" "}
                {paginationState.pageIndex * paginationState.pageSize + 1} to{" "}
                {Math.min(
                  (paginationState.pageIndex + 1) * paginationState.pageSize,
                  totalItems
                )}{" "}
                of {totalItems} entries
              </>
            ) : (
              "No entries found"
            )}
          </div>

          {/* Mobile page size selector */}
          <div className="flex items-center space-x-2 sm:hidden">
            <p className="text-sm text-muted-foreground">Rows</p>
            <Select
              value={`${paginationState.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[60px]">
                <SelectValue placeholder={paginationState.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 lg:space-x-8">
          {/* Desktop page size selector */}
          <div className="hidden sm:flex items-center space-x-2">
            <p className="whitespace-nowrap text-sm font-medium">
              Rows per page
            </p>
            <Select
              value={`${paginationState.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={paginationState.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page info */}
          <div className="flex w-[120px] items-center justify-center text-sm font-medium">
            {totalItems > 0 ? (
              <>
                Page {paginationState.pageIndex + 1} of {table.getPageCount()}
              </>
            ) : (
              "No pages"
            )}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
