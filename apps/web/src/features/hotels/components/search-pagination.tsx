"use client";

import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationUI
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, any>;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams
}: PaginationProps) {
  // Create a utility function to build page URLs
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();

    // Add all current search params except page
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value as string);
      }
    });

    // Set the page parameter
    params.set("page", pageNumber.toString());

    return `${baseUrl}?${params.toString()}`;
  };

  // Determine which page numbers to show
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push("ellipsis");
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Showing page {currentPage} of {totalPages}
      </div>

      <PaginationUI>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href={hasPrevious ? createPageUrl(currentPage - 1) : "#"}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm",
                !hasPrevious
                  ? "pointer-events-none opacity-50 cursor-not-allowed"
                  : "hover:bg-[#003580]/5 hover:text-[#003580]"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </PaginationPrevious>
          </PaginationItem>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageUrl(page)}
                  isActive={page === currentPage}
                  className={cn(
                    "px-3 py-2 text-sm",
                    page === currentPage
                      ? "bg-[#003580] text-white hover:bg-[#002147]"
                      : "hover:bg-[#003580]/5 hover:text-[#003580]"
                  )}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href={hasNext ? createPageUrl(currentPage + 1) : "#"}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm",
                !hasNext
                  ? "pointer-events-none opacity-50 cursor-not-allowed"
                  : "hover:bg-[#003580]/5 hover:text-[#003580]"
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </PaginationUI>
    </div>
  );
}
