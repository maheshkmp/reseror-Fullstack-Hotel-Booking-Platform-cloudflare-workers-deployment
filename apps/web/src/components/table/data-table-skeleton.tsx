import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export function DataTableSkeleton({
  columnCount = 1,
  rowCount = 10,
}) {
  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="relative border rounded-md overflow-hidden bg-background">
        <div className="h-[calc(100vh-220px)] relative overflow-hidden">
          <Table className="relative">
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-transparent border-0">
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableHead key={i} className="h-9 px-3">
                    <Skeleton className="h-3 w-3/4 opacity-40 bg-zinc-400/20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent border-b border-border/40">
                  {Array.from({ length: columnCount }).map((_, i) => (
                    <TableCell key={i} className="py-2 px-3">
                      <Skeleton className="h-4 w-full opacity-40 bg-zinc-400/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-4 px-2 py-1 sm:flex-row sm:gap-8">
        <div className="flex-1">
          <Skeleton className="h-4 w-32 bg-zinc-400/10" />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-7 w-20 bg-zinc-400/10" />
            <Skeleton className="h-7 w-14 bg-zinc-400/10" />
          </div>
          <div className="hidden items-center space-x-2 md:flex">
            <Skeleton className="size-7 bg-zinc-400/10" />
            <Skeleton className="size-7 bg-zinc-400/10" />
            <Skeleton className="size-7 bg-zinc-400/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
