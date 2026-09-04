"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
import type { ad } from "core/zod";
import { Pencil, LinkIcon, Trash2, Globe, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteAd } from "../../actions/use-delete-ad";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import EditAdDialog from "../edit-ad-dialog";

const StatusBadge = React.memo(({ active }: { active: boolean }) => (
  <div className="flex items-center gap-1.5 group/status cursor-default">
    <div className={cn("size-1.5 rounded-full", active ? "bg-emerald-500 animation-pulse" : "bg-amber-500")} />
    <span className="text-[10px] font-bold uppercase tracking-tight text-foreground/70">
      {active ? "Active" : "Paused"}
    </span>
  </div>
));
StatusBadge.displayName = "StatusBadge";

const CellAction = ({ ad }: { ad: ad }) => {
  const { mutate: deleteAd, isPending: isDeleting } = useDeleteAd();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteAd(ad.id.toString(), {
      onSuccess: () => {
        toast.success("Ad deleted");
        queryClient.invalidateQueries({ queryKey: ["ads"] });
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <EditAdDialog ad={ad} />
      
      <Button variant="ghost" size="icon" asChild className="size-7 border border-border/20 shadow-none">
        <Link href={`/admin/ad-management/${ad.id}`}>
          <MoreHorizontal className="size-3.5 text-muted-foreground" />
        </Link>
      </Button>

      {ad.redirectUrl && (
        <Button variant="ghost" size="icon" asChild className="size-7 border border-border/20 shadow-none">
          <a href={ad.redirectUrl} target="_blank" rel="noopener noreferrer">
            <Globe className="size-3.5 text-muted-foreground" />
          </a>
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 border border-border/20 shadow-none hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <Trash2 className="size-3.5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-background border-border shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ad?</AlertDialogTitle>
            <AlertDialogDescription>"{ad.title}" will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<ad>[] = [
  {
    accessorKey: "title",
    header: "Asset",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5 max-w-[250px]">
        {row.original.imageUrl ? (
          <img
            src={row.original.imageUrl}
            alt={row.original.title}
            className="size-7 rounded bg-secondary object-cover border border-border/50 shrink-0"
          />
        ) : (
          <div className="size-7 rounded bg-secondary flex items-center justify-center border border-border/50 shrink-0">
            <LinkIcon className="size-3 text-muted-foreground/50" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-foreground truncate">{row.original.title}</span>
          <span className="text-[9px] text-muted-foreground truncate uppercase tracking-tighter opacity-60">ID: {row.original.id.toString().slice(0, 8)}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "placement",
    header: "Placement",
    cell: ({ row }) => (
      <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-black uppercase tracking-tighter rounded-sm border-border/50 bg-secondary/30 text-foreground/70">
        {row.original.placement || "Sidebar"}
      </Badge>
    ),
  },
  {
    accessorKey: "hotelId",
    header: "Source",
    cell: ({ row }) => {
      const creatorRole = (row.original as any).creatorRole;
      const isAdmin = creatorRole === "admin";
      
      return (
        <div className="flex items-center">
          {isAdmin ? (
            <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-black uppercase tracking-widest rounded-sm border-blue-200 bg-blue-50 text-blue-700">
              System
            </Badge>
          ) : (
            <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-black uppercase tracking-widest rounded-sm border-purple-200 bg-purple-50 text-purple-700">
              Property
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Rank",
    cell: ({ row }) => (
      <span className="text-[10px] font-black text-foreground tabular-nums">
        #{row.original.priority || 0}
      </span>
    ),
  },
  {
    accessorKey: "promoCode",
    header: "Promo",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-foreground tabular-nums uppercase">
          {row.original.promoCode || "—"}
        </span>
        {row.original.discountPercent && (
          <span className="text-[9px] text-emerald-600 font-bold leading-none">
            {row.original.discountPercent}% OFF
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "usageCount",
    header: "Usage",
    cell: ({ row }) => {
      const usageCount = (row.original as any).usageCount || 0;
      const usageLimit = (row.original as any).usageLimit;
      const isUnique = (row.original as any).isUniquePerUser;
      const minBooking = (row.original as any).minBookingValue;

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-foreground tabular-nums">
              {usageCount}
            </span>
            <span className="text-[9px] text-muted-foreground font-bold">
              / {usageLimit || "∞"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {isUnique && (
              <Badge variant="outline" className="h-3.5 px-1 text-[7px] font-black uppercase tracking-tighter rounded-sm border-amber-200 bg-amber-50 text-amber-700">
                Unique
              </Badge>
            )}
            {minBooking && Number(minBooking) > 0 && (
              <Badge variant="outline" className="h-3.5 px-1 text-[7px] font-black uppercase tracking-tighter rounded-sm border-blue-200 bg-blue-50 text-blue-700">
                Min: ${minBooking}
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <StatusBadge active={!!row.original.isActive} />,
  },
  {
    accessorKey: "startDate",
    header: "Schedule",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-[10px] font-medium text-foreground tabular-nums uppercase">
          {row.original.startDate ? new Date(row.original.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "∞"}
          <span className="mx-1 text-muted-foreground">→</span>
          {row.original.endDate ? new Date(row.original.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "∞"}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction ad={row.original} />,
  },
];
