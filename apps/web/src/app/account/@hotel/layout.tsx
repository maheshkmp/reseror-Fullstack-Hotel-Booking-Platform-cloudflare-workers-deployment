import React from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
          "--sidebar-background": "#07143d",
          "--sidebar-foreground": "rgba(255, 255, 255, 0.9)",
          "--sidebar-primary": "#f59e0b",
          "--sidebar-primary-foreground": "white",
          "--sidebar-accent": "rgba(255, 255, 255, 0.1)",
          "--sidebar-accent-foreground": "#f59e0b",
          "--sidebar-border": "rgba(255, 255, 255, 0.05)",
          "--sidebar-ring": "#f59e0b"
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background">
        <SiteHeader />

        <div className="flex flex-1 flex-col h-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
