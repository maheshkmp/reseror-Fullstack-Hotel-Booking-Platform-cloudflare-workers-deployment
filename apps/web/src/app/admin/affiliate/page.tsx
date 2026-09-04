import AffiliateManagement from "@/features/admin/affiliate/components/affiliate-management";
import PageContainer from "@/modules/layouts/page-container";

export const metadata = {
  title: "Affiliate Management | Admin",
};

export default function AffiliatePage() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col pt-4">
        <AffiliateManagement />
      </div>
    </PageContainer>
  );
}
