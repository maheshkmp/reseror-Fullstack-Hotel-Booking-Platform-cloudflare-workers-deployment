import StaffListing from "@/features/staff-management/components/staff-listing";
import PageContainer from "@/modules/layouts/page-container";

export const metadata = {
  title: "Staff Management | Admin",
  description: "Manage system staff and administrators",
};

export default function StaffPage() {
  return (
    <PageContainer scrollable>
      <StaffListing />
    </PageContainer>
  );
}
