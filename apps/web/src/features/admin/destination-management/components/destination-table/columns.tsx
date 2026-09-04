"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
import type { destination } from "core/zod";
import { Pencil, Globe, Trash2, MapPin, Star, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteDestination } from "../../actions/delete-action";
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
import { EditDestinationForm } from "../edit-destination-form";

const RecommendedBadge = React.memo(({ recommended }: { recommended: boolean }) => {
  if (!recommended) return null;
  return (
    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-sm border border-amber-200/50">
      <Star className="size-2.5 fill-amber-500 text-amber-500" />
      <span className="text-[9px] font-black uppercase tracking-tighter">Recommended</span>
    </div>
  );
});
RecommendedBadge.displayName = "RecommendedBadge";

const CellAction = ({ destination }: { destination: destination }) => {
  const { mutate: deleteDestination, isPending: isDeleting } = useDeleteDestination();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteDestination(destination.id, {
      onSuccess: () => {
        toast.success("Destination deleted");
        queryClient.invalidateQueries({ queryKey: ["destinations"] });
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <EditDestinationForm destination={destination} />
      
      <Button variant="ghost" size="icon" asChild className="size-7 border border-border/20 shadow-none">
        <Link href={`/admin/property-type/${destination.id}`}>
          <MoreHorizontal className="size-3.5 text-muted-foreground" />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 border border-border/20 shadow-none hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <Trash2 className="size-3.5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-background border-border shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Destination?</AlertDialogTitle>
            <AlertDialogDescription>"{destination.title}" will be permanently removed.</AlertDialogDescription>
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

export const columns: ColumnDef<destination>[] = [
  {
    accessorKey: "title",
    header: "Destination",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5 max-w-[250px]">
        {row.original.featuredImage ? (
          <img
            src={row.original.featuredImage}
            alt={row.original.title}
            className="size-7 rounded bg-secondary object-cover border border-border/50 shrink-0"
          />
        ) : (
          <div className="size-7 rounded bg-secondary flex items-center justify-center border border-border/50 shrink-0">
            <MapPin className="size-3 text-muted-foreground/50" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-foreground truncate">{row.original.title}</span>
          <span className="text-[9px] text-muted-foreground truncate uppercase tracking-tighter opacity-60 italic">{row.original.slug}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-black uppercase tracking-tighter rounded-sm border-border/50 bg-secondary/30 text-foreground/70">
        {row.original.category || "General"}
      </Badge>
    ),
  },
  {
    accessorKey: "popularityScore",
    header: "Popularity",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-black text-foreground tabular-nums">
          {row.original.popularityScore || 0}
        </span>
        <RecommendedBadge recommended={!!row.original.recommended} />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Timeline",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-foreground tabular-nums uppercase">
          {new Date(row.original.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
        </span>
        <span className="text-[9px] text-muted-foreground tabular-nums uppercase opacity-60">
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction destination={row.original} />,
  },
];
