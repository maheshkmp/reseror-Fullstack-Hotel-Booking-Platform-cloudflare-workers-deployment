import { ArticleList } from "@/features/admin/article-management/components/article-list";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

export default function ArticleManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Articles"
          description="Manage platform content and publication pipeline"
          actionComponent={
            <Button
              asChild
              size="sm"
              className="flex items-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-tight text-[11px] h-8 shadow-none"
            >
              <Link href="/admin/article-management/new">
                <PlusCircleIcon className="w-3.5 h-3.5" />
                New Article
              </Link>
            </Button>
          }
        />

        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
          <Suspense fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}>
            <ArticleList />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
