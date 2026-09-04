import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { GlobalCommissionForm } from "@/features/admin/settings/components/global-commission-form";

export default function BookingCommissionPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Global Hotel Booking Commission"
          description="Configure the global commission percentage for hotel bookings"
          actionComponent={undefined}
        />

        <div className="flex-1 p-6">
          <GlobalCommissionForm />
        </div>
      </div>
    </PageContainer>
  );
}
