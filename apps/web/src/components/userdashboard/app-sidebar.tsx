"use client";

import { IconBox, IconBuildings } from "@tabler/icons-react";
import * as React from "react";

import { getUserDetails } from "@/components/dashboard/get-user-details";
import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
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
import { PiBuilding } from "react-icons/pi";

const LogoIcon = () => (
  <Link href="/" aria-label="Home">
    <Image
      src="/assets/reseror.png"
      alt="Reseror"
      width={130}
      height={100}
      className="object-contain"
      style={{ height: "auto" }}
    />
  </Link>
);

const data = {
  navMain: [
    {
      title: "",
      url: "/",
      icon: LogoIcon,
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
      name: "Dashboard",
      url: "/account",
      icon: IconBox,
    },
    {
      name: "Bookings",
      url: "/account/booking-details",
      icon: IconBox,
    },
    {
      name: "Wishlist",
      url: "/account/wishlist",
      icon: IconBox,
    },
    {
      name: "Profile",
      url: "/account/profile",
      icon: IconBox,
    },
    // {
    //   name: "Manage Payments",
    //   url: "/account/payment-details",
    //   icon: IconBox,
    // },
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {activeOrg.isPending ? (
              <Skeleton className="h-6 w-full rounded-md" />
            ) : activeOrg.data ? (
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <div>
                  {activeOrg.data.logo ? (
                    <Image
                      src={activeOrg.data.logo}
                      alt="Organization Logo"
                      width={24}
                      height={24}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded">
                      <PiBuilding className="size-4" />
                    </div>
                  )}

                  <span className="text-base font-semibold font-heading">
                    {activeOrg.data.name}
                  </span>
                </div>
              </SidebarMenuButton>
            ) : (
              <></>
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
