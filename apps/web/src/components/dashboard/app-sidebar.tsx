"use client";

import { IconBed, IconBox, IconBuildings, IconCalendar, IconCalendarCheck, IconCreditCard, IconDashboard, IconStar, IconTag, IconToolsKitchen2 } from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import { useGetRoomBookings } from "@/features/roomBookings/actions/get-room-booking";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { getUserDetails } from "./get-user-details";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/account",
      icon: IconDashboard,
    },
    {
      title: "Booking Calendar",
      url: "/account/calendar",
      icon: IconCalendar,
    },
  ],
  navSecondary: [
    
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: IconSettings,
    // },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: IconHelp,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  documents: [
    {
      name: "Manage Property",
      url: "/account/manage",
      icon: IconBuildings,
    },
    {
      name: "Rooms",
      url: "/account/manage/rooms",
      icon: IconBed,
    },
    {
      name: "Restaurants",
      url: "/account/manage/restaurants",
      icon: IconToolsKitchen2,
    },
    {
      name: "Bookings",
      url: "/account/manage/booking-details",
      icon: IconCalendarCheck,
    },
    {
      name: "Reviews",
      url: "/account/manage/reviews",
      icon: IconStar,
    },
    {
      name: "Promotions",
      url: "/account/manage/advertisements",
      icon: IconTag,
    },
    {
      name: "Payments",
      url: "/account/manage/payment-details",
      icon: IconCreditCard,
    },
  ],
  userManagement: [
    {
      name: "All Users",
      url: "/dashboard/users",
      icon: IconBuildings,
    },
    {
      name: "Organizations",
      url: "/dashboard/organizations",
      icon: IconBuildings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeOrg = authClient.useActiveOrganization();
  const user = getUserDetails();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            {activeOrg.isPending ? (
              <Skeleton className="h-20 w-full rounded-md bg-sidebar-accent" />
            ) : (
              <div className="flex flex-col gap-4">
                {/* Dual Logo Section */}
                <div className="flex items-center justify-between gap-2 px-1">
                  <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
                    <span className="font-extrabold text-xl tracking-tight text-sidebar-foreground">
                      Reseror
                    </span>
                  </Link>
                  
                  {activeOrg.data?.logo && (
                    <div className="h-8 w-px bg-sidebar-border mx-1" />
                  )}

                  {activeOrg.data?.logo && (
                    <div className="flex items-center bg-sidebar-accent rounded-md p-1.5 border border-sidebar-border">
                      <Image
                        src={activeOrg.data.logo}
                        alt="Company Logo"
                        width={32}
                        height={32}
                        className="rounded object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Role & Company Details */}
                {/* <div className="bg-sidebar-accent/50 rounded-lg p-3 border border-sidebar-border space-y-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                      {user.roleName}
                    </span>
                    <span className="text-sm font-semibold text-sidebar-foreground truncate leading-tight mt-1">
                      {activeOrg.data?.name || "My Organization"}
                    </span>
                  </div>
                  
                  {activeOrg.data?.metadata?.website && (
                    <div className="flex items-center gap-1.5 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
                      <span className="truncate">{activeOrg.data.metadata.website}</span>
                    </div>
                  )}

                  <div className="flex flex-col pt-1 border-t border-sidebar-border">
                    <span className="text-[10px] text-sidebar-foreground/40 leading-none mb-1">Authenticated as</span>
                    <span className="text-xs text-sidebar-foreground/70 truncate">{user.email}</span>
                  </div>
                </div> */}
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        {/* <NavUserManagement items={data.userManagement} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
