"use client";
import React from "react";

import { AppSidebar } from "@/components/userdashboard/app-sidebar";
import { SiteHeader } from "@/components/userdashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserDetails } from "@/components/dashboard/get-user-details";
import { Navbar } from "@/modules/layouts/navbar";

type Props = {
  children?: React.ReactNode;
};

export default function UserDashboardLayout({ children }: Props) {
  const user = getUserDetails();
  const showSidebar = user.role === "admin" || user.role === "hotelOwner";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 52)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {showSidebar && <AppSidebar variant="inset" />}
      <SidebarInset className="bg-background">
        {user.role === "user" ? <Navbar /> : <SiteHeader />}

        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
