"use client";
import { BellIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";
import { getUserDetails } from "@/components/dashboard/get-user-details";
import Image from "next/image";

export function SiteHeader() {
  const user = getUserDetails();
  const showSidebar = user.role === "admin" || user.role === "hotelOwner";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white transition-[width,height] ease-linear px-4 md:px-8">
      <div className="flex items-center gap-4">
        {showSidebar && <SidebarTrigger className="-ml-1" />}
        <Link href="/" aria-label="Home" className="flex items-center gap-2">
          <span className="font-extrabold text-xl md:text-2xl tracking-tight text-[#003580]">
            Reseror
          </span>
        </Link>
      </div>

      {/* Centered Search Bar */}
      <div className="hidden flex-1 items-center justify-center md:flex">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by project, traveler or team..."
            className="h-10 w-full rounded-md border-none bg-gray-50 px-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <BellIcon className="h-5 w-5 text-gray-500" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>

        <div className="flex items-center gap-2">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={36}
              height={36}
              className="rounded-full object-cover border border-gray-200"
              style={{ height: "auto" }}
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A5F] text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
