import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { PropertyAttributesTabs } from "@/features/admin/property-attributes-management/components/property-attributes-tabs";

export default function PropertyAttributesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Property Attributes"
          description="Manage property classes, property types, and the global amenities pool available to hotel owners." actionComponent={undefined}        />
        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
          <PropertyAttributesTabs />
        </div>
      </div>
    </PageContainer>
  );
}
