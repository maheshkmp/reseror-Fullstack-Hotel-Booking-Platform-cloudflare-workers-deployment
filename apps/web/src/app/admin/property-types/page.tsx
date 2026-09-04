import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { PropertyTypesTableActions } from "@/features/admin/property-type-management/components/hotel-types-table/hotelTypes-table-actions";
import PropertyTypesListing from "@/features/admin/property-type-management/components/property-types-listing";

export default function PropertyTypesManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Property Types"
          description="Manage property classifications and metadata"
          actionComponent={<PropertyTypesTableActions />}
        />

        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
          <PropertyTypesListing />
        </div>
      </div>
    </PageContainer>
  );
}
