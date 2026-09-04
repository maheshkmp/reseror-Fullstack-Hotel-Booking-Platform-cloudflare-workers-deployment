"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RoomBookingSchema } from "@/features/roomBookings/schemas/roomBookings.schema";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";
import { cn } from "@/lib/utils";
import React from "react";

const StatusBadge = React.memo(({ status }: { status: string }) => {
  const variants: Record<string, { label: string; color: string }> = {
    confirmed: { label: "Confirmed", color: "bg-emerald-500" },
    pending: { label: "Pending", color: "bg-amber-500" },
    cancelled: { label: "Cancelled", color: "bg-rose-500" },
  };

  const config = variants[status?.toLowerCase()] || { label: status, color: "bg-zinc-400" };

  return (
    <div className="flex items-center gap-1.5 group/status cursor-default">
      <div className={cn("size-1.2 rounded-full animate-pulse", config.color)} />
      <span className="text-[9px] font-bold uppercase tracking-tight text-foreground/70">
        {config.label}
      </span>
    </div>
  );
});

StatusBadge.displayName = "StatusBadge";

export const columns: ColumnDef<RoomBookingSchema>[] = [
  {
    accessorKey: "guestName",
    header: "Guest",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 max-w-[150px]">
        <div className="size-6 rounded bg-secondary flex items-center justify-center text-[9px] font-bold text-muted-foreground border border-border/50 shrink-0">
          {row.original.guestName.slice(0, 2).toUpperCase()}
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
    header: "Stay",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-foreground">
            {new Date(row.original.checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
          </span>
          <span className="text-[10px] text-muted-foreground">→</span>
          <span className="text-[10px] font-bold text-foreground">
            {new Date(row.original.checkOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
          </span>
        </div>
        <div className="text-[9px] text-muted-foreground uppercase tracking-tight truncate max-w-[100px]">
          {row.original.numRooms}R • {row.original.numAdults}A {row.original.numChildren > 0 ? `• ${row.original.numChildren}C` : ''}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Financials",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-black text-foreground">
            {row.original.totalAmount.toLocaleString()}
          </span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase">{row.original.currency}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded-sm">
            +{row.original.netPayableToHotel}
          </span>
          <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1 rounded-sm">
            -{row.original.commissionAmount}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "isPaid",
    header: "Payment",
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className={cn(
          "h-3.5 px-1 text-[8px] font-black uppercase tracking-tighter rounded-sm",
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
    header: "Recorded",
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
