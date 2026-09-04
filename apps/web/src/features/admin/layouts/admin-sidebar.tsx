"use client";

import { 
  IconLayoutDashboard, 
  IconUsers, 
  IconBuildingCommunity, 
  IconCalendarCheck, 
  IconCreditCard, 
  IconFileText, 
  IconSpeakerphone, 
  IconSettings,
  IconHierarchy2,
  IconCategory,
  IconUserShield
} from "@tabler/icons-react";
import * as React from "react";

import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { getUserDetails } from "@/components/dashboard/get-user-details";
import { AdminSidebarNav } from "./sidebar-nav";

const data = {
  main: [
    {
      name: "Dashboard",
      url: "/admin",
      icon: IconLayoutDashboard,
    },
    {
      name: "Users",
      url: "#",
      icon: IconUsers,
      subItems: [
        {
          name: "All Users",
          url: "/admin/users",
        },
        {
          name: "Staff Members",
          url: "/admin/staff",
        }
      ]
    },
    {
      name: "Manage Properties",
      url: "#",
      icon: IconBuildingCommunity,
      subItems: [
        {
          name: "Properties",
          url: "/admin/properties",
        },
        {
          name: "Payments",
          url: "/admin/adminPayments",
        },
      ],
    },
    {
      name: "Property Settings",
      url: "#",
      icon: IconCategory,
      subItems: [
        {
          name: "Property Attributes",
          url: "/admin/property-attributes",
        },
        {
          name: "Booking Commission",
          url: "/admin/booking-commission",
        },
      ],
    },
    {
      name: "Bookings",
      url: "/admin/roomBookings",
      icon: IconCalendarCheck,
    },
    {
      name: "Advertisements",
      url: "/admin/ad-management",
      icon: IconSpeakerphone,
    },

    {
      name: "Articles & Affiliates",
      url: "#",
      icon: IconFileText,
      subItems: [
        {
          name: "Articles",
          url: "/admin/article-management",
        },
        {
          name: "Affiliates",
          url: "/admin/affiliate",
        },
      ],
    },
    {
      name: "Destinations",
      url: "/admin/destinations",
      icon: IconHierarchy2,
    },
    {
      name: "Settings",
      url: "#",
      icon: IconSettings,
      subItems: [
        {
          name: "Site Information",
          url: "/admin/settings/site-info",
        },
        {
          name: "Contact Information",
          url: "/admin/settings/contact",
        },
        {
          name: "Legal Policies",
          url: "/admin/settings/legal",
        },
        {
          name: "Backup & Restore",
          url: "/admin/backup",
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = getUserDetails();
  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-border/50">
      <SidebarHeader className="h-14 border-b border-border/50 flex items-center px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center px-2">
              <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <span className="font-extrabold text-xl tracking-tight text-sidebar-foreground">
                  Reseror Admin
                </span>
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="admin-compact">
        <AdminSidebarNav items={data.main} />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-2">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
