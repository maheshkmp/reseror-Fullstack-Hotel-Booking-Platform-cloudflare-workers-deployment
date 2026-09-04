"use client";

import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";

interface NoResultsProps {
  searchTerm?: string;
}

export function NoResults({ searchTerm = "" }: NoResultsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col items-center justify-center py-16 px-8">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <SearchX className="h-16 w-16 text-gray-400" />
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          No property found
        </h3>

        {searchTerm ? (
          <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
            We couldn't find any property matching{" "}
            <span className="font-semibold text-[#003580]">"{searchTerm}"</span>
            . Try adjusting your search filters or explore our featured
            properties.
          </p>
        ) : (
          <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
            No property match the selected filters. Try different filter options
            or explore all our available properties.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/search">
            <Button
              variant="outline"
              className="border-[#003580] text-[#003580] hover:bg-[#003580]/5"
            >
              Clear All Filters
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-[#003580] hover:bg-[#002147]">
              Explore Featured Hotels
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
