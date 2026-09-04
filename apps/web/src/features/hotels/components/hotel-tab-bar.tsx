"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {};

const HotelTabs = [
  { name: "Overview", href: "/account/manage" },
  { name: "Rooms", href: "/account/manage/rooms" },
  { name: "Restaurants", href: "/account/manage/restaurants" },
  { name: "Bookings", href: "/account/manage/booking-details" },
  { name: "Reviews", href: "/account/manage/reviews" },
  { name: "Payments", href: "/account/manage/payment-details" },
  // { name: "Settings", href: "/account/manage/settings" },
];

export function HotelTabBar({}: Props) {
  const pathname = usePathname();

  const currentTab = HotelTabs.find((tab) => tab.href === pathname);

  return (
    <div className="flex items-center gap-0.5">
      {HotelTabs.map((tab) => (
        <Button
          key={tab.href}
          variant={"ghost"}
          className={cn(
            `px-4 min-h-11 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            currentTab?.href === tab.href &&
              "border-b-2 border-primary bg-secondary/30"
          )}
          asChild
        >
          <Link href={tab.href}>{tab.name}</Link>
        </Button>
      ))}
    </div>
  );
}
