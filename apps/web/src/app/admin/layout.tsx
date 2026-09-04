"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/dashboard/site-header";
import { AdminSidebar } from "@/features/admin/layouts/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const pathname = usePathname();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 14)"
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="sidebar" collapsible="icon" />
      <SidebarInset className="bg-background !p-0">
        <SiteHeader />
        
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 min-h-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
