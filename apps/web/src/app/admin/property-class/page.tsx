import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { PropertyClassTableActions } from "@/features/admin/property-class-management/components/propertyClass-table/propertyClasses-table-actions";
import PropertyClasssListing from "@/features/admin/property-class-management/components/propertyClasses-listing";

export default function PropertyClassManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Property Classes"
          description="Manage property rating and quality classifications"
          actionComponent={<PropertyClassTableActions />}
        />

        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
          <PropertyClasssListing />
        </div>
      </div>
    </PageContainer>
  );
}
