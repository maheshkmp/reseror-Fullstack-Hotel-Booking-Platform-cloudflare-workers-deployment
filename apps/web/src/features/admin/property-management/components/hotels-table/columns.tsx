"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import React, { useState } from "react";
import { HotelSelectType } from "@/features/admin/property-management/schemas";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CellAction } from "./cell-action";
import { Switch } from "@/components/ui/switch";
import { useUpdateHotelByID } from "@/features/hotels/queries/use-update-hotel-by-id";
import { useUpdateRestaurant } from "@/features/resturant/actions/use-update-restaurant";
import { toast } from "sonner";
import {
  Building2,
  TrendingUp,
  Users,
  Calendar,
  Pencil,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StatusToggle = React.memo(({ hotel }: { hotel: any }) => {
  const isRestaurant = !!hotel.isRestaurant;
  const { mutate: updateHotel, isPending: isHotelPending } = useUpdateHotelByID();
  const { mutate: updateRestaurant, isPending: isRestaurantPending } = useUpdateRestaurant();

  const isPending = isHotelPending || isRestaurantPending;
  const [checked, setChecked] = useState(hotel.status === "active");

  const handleToggle = (val: boolean) => {
    const newStatus = val ? "active" : "inactive";
    setChecked(val);

    if (isRestaurant) {
      updateRestaurant(
        { id: hotel.id, data: { status: newStatus } as any },
        {
          onSuccess: () => {
            toast.success(`Restaurant status set to ${newStatus}`);
          },
          onError: (err) => {
            setChecked(!val);
            toast.error(`Failed to update status: ${err.message}`);
          },
        }
      );
    } else {
      updateHotel(
        { id: hotel.id, data: { status: newStatus } as any },
        {
          onSuccess: () => {
            toast.success(`Hotel status set to ${newStatus}`);
          },
          onError: (err) => {
            setChecked(!val);
            toast.error(`Failed to update status: ${err.message}`);
          },
        }
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="scale-75 data-[state=checked]:bg-emerald-500 shadow-none border-0"
      />
      <span className={React.useMemo(() => `text-[10px] font-bold uppercase tracking-tight ${checked ? "text-emerald-600" : (hotel.status === "paused" ? "text-amber-600" : "text-muted-foreground/60")
        }`, [checked, hotel.status])}>
        {hotel.status === "paused" ? "Paused" : (checked ? "Active" : "Inactive")}
      </span>
    </div>
  );
});

StatusToggle.displayName = "StatusToggle";

export const columns: ColumnDef<HotelSelectType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] shadow-none border-border"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] shadow-none border-border"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Property",
    cell: ({ row }) => {
      const hotel = row.original;
      if (!hotel) return null;

      const name = hotel.name || "Unnamed Property";
      let thumbnail = hotel.images?.find((img: any) => img.isThumbnail) || hotel.images?.[0];

      return (
        <div className="flex items-center gap-2.5">
          {thumbnail?.imageUrl ? (
            <div className="relative flex-shrink-0">
              <Image
                alt={name}
                src={thumbnail.imageUrl}
                width={28}
                height={28}
                className="size-8 rounded bg-muted object-cover border border-border/40"
              />
            </div>
          ) : (
            <div className="size-8 rounded bg-secondary flex items-center justify-center text-[9px] font-bold text-muted-foreground border border-border/40 uppercase flex-shrink-0">
              {name.slice(0, 2)}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <Link
              href={(hotel as any).isRestaurant ? `/admin/restaurants/${hotel.id}` : `/admin/properties/${hotel.id}/setup`}
              className="font-bold text-foreground line-clamp-1 text-[13px] leading-tight flex items-center gap-1 hover:text-indigo-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
            >
              {name}
              {hotel.status === "pending_approval" && (
                <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" title="Pending Approval" />
              )}
              {hotel.performance?.isOverdue && (
                <Badge variant="destructive" className="h-3.5 px-1 py-0 text-[8px] font-black uppercase tracking-tighter bg-red-500 text-white border-0 leading-none">
                  Overdue
                </Badge>
              )}
            </Link>
            <span className="text-[10px] text-muted-foreground/70 font-medium truncate">
              {hotel.hotelType?.name || "No Type"} • {hotel.propertyClass?.name || "No Class"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "inventory",
    header: "Inventory",
    cell: ({ row }) => {
      const property = row.original as any;
      const perf = property.performance;
      const isRestaurant = !!property.isRestaurant;

      return (
        <div className="flex flex-col text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground/60 w-8">{isRestaurant ? "Seats" : "Rooms"}</span>
            <span className="font-bold text-foreground">{perf?.totalRooms || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground/60 w-8">{isRestaurant ? "Brand" : "Types"}</span>
            <span className="font-medium text-muted-foreground truncate max-w-[80px]">
              {isRestaurant ? (property.brandName || "N/A") : (property.roomTypes?.length || 0)}
            </span>
          </div>
        </div>
      );
    }
  },
  {
    id: "performance",
    header: "Earnings",
    cell: ({ row }) => {
      const perf = row.original.performance;
      return (
        <div className="flex flex-col text-[11px]">
          <div className="flex items-center gap-1">
            <TrendingUp className="size-3 text-muted-foreground/40" />
            <span className="font-bold text-foreground">
              ${(perf?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-3 text-muted-foreground/40" />
            <span className="font-semibold text-muted-foreground">
              {perf?.totalBookings || 0}
            </span>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Availability",
    cell: ({ row }) => <StatusToggle hotel={row.original} />,
  },
  {
    id: "quick_actions",
    header: "",
    cell: ({ row }) => {
      const property = row.original as any;
      const isRestaurant = !!property.isRestaurant;

      return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="size-7 h-7 w-7 rounded-sm hover:bg-accent" asChild title="Full Setup">
            <Link href={isRestaurant ? `/admin/restaurants/${property.id}` : `/admin/properties/${property.id}/setup`} onClick={(e) => e.stopPropagation()}>
              <Pencil className="size-3.5 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="size-7 h-7 w-7 rounded-sm hover:bg-accent" asChild title="View Public">
            <Link href={isRestaurant ? `/restaurants/${property.id}` : `/hotels/${property.slug || property.id}`} target="_blank">
              <Eye className="size-3.5 text-muted-foreground" />
            </Link>
          </Button>
          {!isRestaurant && <CellAction data={property} hotelId={property.id} />}
        </div>
      );
    },
  },
];
