import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { DestinationList } from "@/features/admin/destination-management/components/destination-list";
import { CreateDestination } from "@/features/admin/destination-management/components/create-new-destination";

export default function DestinationsManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Destinations"
          description="Manage popular travel locations and regions"
          actionComponent={<CreateDestination />}
        />

        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
          <DestinationList />
        </div>
      </div>
    </PageContainer>
  );
}
