"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RoomBookingSchema } from "@/features/roomBookings/schemas/roomBookings.schema";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";
import { cn } from "@/lib/utils";
import React from "react";

import { Checkbox } from "@/components/ui/checkbox";

const StatusBadge = React.memo(({ status }: { status: string }) => {
  const variants: Record<string, { label: string; color: string }> = {
    confirmed: { label: "Confirmed", color: "bg-emerald-500" },
    pending: { label: "Pending", color: "bg-amber-500" },
    cancelled: { label: "Cancelled", color: "bg-rose-500" },
  };

  const config = variants[status?.toLowerCase()] || { label: status, color: "bg-zinc-400" };

  return (
    <div className="flex items-center gap-1.5 group/status cursor-default">
      <div className={cn("size-1.5 rounded-full animate-pulse", config.color)} />
      <span className="text-[10px] font-bold uppercase tracking-tight text-foreground/70">
        {config.label}
      </span>
    </div>
  );
});

StatusBadge.displayName = "StatusBadge";

export const columns: ColumnDef<RoomBookingSchema>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "guestName",
    header: "Guest",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="size-7 rounded bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border/50">
          {row.original.guestName?.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-foreground truncate">
            {row.original.guestName}
          </span>
          <span className="text-[9px] text-muted-foreground truncate uppercase tracking-tighter">
            {row.original.guestEmail}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "stay",
    header: "Stay Details",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-foreground">
            {row.original.checkInDate ? new Date(row.original.checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) : '-'}
          </span>
          <span className="text-[10px] text-muted-foreground">→</span>
          <span className="text-[10px] font-bold text-foreground">
            {row.original.checkOutDate ? new Date(row.original.checkOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) : '-'}
          </span>
        </div>
        <div className="text-[9px] text-muted-foreground uppercase tracking-tight">
          {row.original.numRooms ?? 0} Room{(row.original.numRooms ?? 0) > 1 ? 's' : ''} • {row.original.numAdults ?? 0}A {(row.original.numChildren ?? 0) > 0 ? `• ${row.original.numChildren}C` : ''}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-[11px] font-black text-foreground">
          {(row.original.totalAmount ? Number(row.original.totalAmount) : 0).toLocaleString()} {row.original.currency}
        </span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">
          {row.original.paymentType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status || ""} />,
  },
  {
    accessorKey: "isPaid",
    header: "Payment",
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className={cn(
          "h-4 px-1.5 text-[9px] font-black uppercase tracking-tighter rounded-sm",
          row.original.isPaid 
            ? "border-emerald-500/20 bg-emerald-50/50 text-emerald-700" 
            : "border-rose-500/20 bg-rose-50/50 text-rose-700"
        )}
      >
        {row.original.isPaid ? "Paid" : "Pending"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-[10px] text-muted-foreground tabular-nums">
        {new Date(row.original.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction />,
  },
];
