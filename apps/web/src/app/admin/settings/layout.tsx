import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your site information, contact details, and legal policies.
        </p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {children}
      </div>
    </div>
  );
}
