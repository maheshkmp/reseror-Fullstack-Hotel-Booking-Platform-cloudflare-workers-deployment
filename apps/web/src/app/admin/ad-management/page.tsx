import AdList from "@/features/admin/ad/components/ad-list";
import CreateNewAd from "@/features/admin/ad/components/create-new-ad";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function AdManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Advertising Assets"
          description="Manage sponsored content and promotional placements"
          actionComponent={<CreateNewAd />}
        />

        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
          <AdList />
        </div>
      </div>
    </PageContainer>
  );
}
