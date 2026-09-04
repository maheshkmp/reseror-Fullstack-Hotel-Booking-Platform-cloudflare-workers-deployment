import { AppPageShell } from "@/modules/layouts/page-shell";
import PageContainer from "@/modules/layouts/page-container";
import { BackupPanel } from "@/features/admin/backup/components/backup-panel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backup & Restore | Admin",
  description: "Manage database backups and perform restorations",
};

export default function BackupAdminPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <AppPageShell
          title="Backup & Restore"
          description="Create logical database snapshots and restore data from previous backups."
          actionComponent={null}
        />
        <div className="flex flex-1 flex-col mt-4">
          <BackupPanel />
        </div>
      </div>
    </PageContainer>
  );
}
