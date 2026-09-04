import { Separator } from "@/components/ui/separator";
import UsersListing from "@/features/admin/users-management/components/users-listing";
import { UsersTableActions } from "@/features/admin/users-management/components/users-table/users-table-actions";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { listUsers } from "@/features/admin/users-management/actions/get-users";
import { searchParams } from "@/lib/searchparams";

export default async function UserManagementPage({
  searchParams: searchParamsPromise
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParamsPromise;
  const page = searchParams.page.parse(params.page) ?? undefined;
  const limit = searchParams.limit.parse(params.limit) ?? undefined;
  const search = searchParams.q.parse(params.q) ?? undefined;
  const tab = searchParams.tab.parse(params.tab) ?? undefined;
  const status = searchParams.status.parse(params.status) ?? undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users", { page, limit, search, tab, status }],
    queryFn: () => listUsers({ page, limit, search, tab, status }),
  });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-6 max-w-[1600px] mx-auto w-full">
        <AppPageShell
          title="User Management"
          description="Monitor and manage all platform participants from a central command center."
          actionComponent={<></>}
        />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="flex flex-col gap-1">
            <Suspense fallback={<Skeleton className="h-20 w-full rounded-2xl" />}>
              <UsersTableActions />
            </Suspense>
            
            <Separator className="bg-border/40" />
            
            <Suspense fallback={
              <div className="space-y-4 pt-4">
                <Skeleton className="h-10 w-[400px] rounded-xl" />
                <Skeleton className="h-[600px] w-full rounded-2xl" />
              </div>
            }>
              <UsersListing />
            </Suspense>
          </div>
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}

