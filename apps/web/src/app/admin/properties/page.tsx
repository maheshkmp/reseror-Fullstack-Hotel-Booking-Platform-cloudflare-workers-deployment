import PropertiesListing from "@/features/admin/property-management/components/properties-listing";
import PageContainer from "@/modules/layouts/page-container";

export default function PropertyManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col pt-4">
        <PropertiesListing />
      </div>
    </PageContainer>
  );
}
