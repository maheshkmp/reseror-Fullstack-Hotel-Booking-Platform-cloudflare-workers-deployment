"use client";

import { useSearchParams } from "next/navigation";
import { useGetArticles } from "../api/use-get-article";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { SearchBar } from "./search-bar";
import { columns } from "./article-table/columns";
import DataTableError from "@/components/table/data-table-error";

export function ArticleList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  
  const { data, isLoading, isError, error } = useGetArticles({
    page,
    limit: 10,
    sort: "desc",
    search,
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={10} />;
  }

  if (isError || !data) {
    return <DataTableError error={error as any} />;
  }

  const articles = data.data || [];
  const meta = data.meta || { totalItems: 0 };

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden">
      <div className="flex items-center justify-between gap-4 bg-secondary/20 p-2 rounded-md border border-border/40">
        <SearchBar />
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-2">
          {meta.totalItems} articles
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden bg-background border border-border/40 rounded-md">
        <DataTable
          columns={columns}
          data={articles}
          totalItems={meta.totalItems}
        />
      </div>
    </div>
  );
}
