"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Trash2, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { InboxIcon } from "lucide-react";
import type { Amenity } from "core/zod";
import { useGetGlobalAmenities } from "../api/use-get-amenities";
import { useDeleteAmenity } from "../api/use-delete-amenity";
import { AmenityForm } from "./amenity-form";
import { AmenityIcon } from "./amenity-icon";
import { formatDistanceToNow } from "date-fns";

function AmenityCard({ amenity }: { amenity: Amenity }) {
  const { mutateAsync: deleteAmenity, isPending } = useDeleteAmenity();
  const createdAtDate = amenity.createdAt ? new Date(amenity.createdAt) : null;
  const isValidDate = createdAtDate && !isNaN(createdAtDate.getTime());

  return (
    <Card className="transition-all hover:shadow-md p-4">
      <div className="flex items-center gap-3">
        {/* Icon badge */}
        <div className="h-12 w-12 rounded-lg bg-primary/5 border border-border/40 flex items-center justify-center shrink-0 text-primary">
          <AmenityIcon icon={amenity.icon} className="size-5" />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-sm truncate">{amenity.name}</h3>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest bg-secondary px-1.5 py-0.5 rounded-sm">
              ID: {amenity.id.slice(0, 8)}
            </span>
            {isValidDate && (
              <span className="text-[10px] text-muted-foreground">
                Added {formatDistanceToNow(createdAtDate!)} ago
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {amenity.slug && (
              <Badge variant="secondary" className="text-[10px] font-normal gap-1 rounded-sm px-1.5">
                <Tag className="size-3 opacity-60" />
                {amenity.slug}
              </Badge>
            )}
          </div>
        </div>

        {/* Delete action */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{amenity.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This amenity will be removed from the global pool. Existing hotel listings that reference this amenity will not be affected, but it will no longer be selectable.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => deleteAmenity(amenity.id)}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}

export function AmenitiesListing() {
  const { data, isPending, error } = useGetGlobalAmenities();

  if (isPending) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2">
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 px-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <span className="text-rose-500 font-bold">!</span>
        </div>
        <h3 className="text-lg font-semibold">Failed to load amenities</h3>
        <p className="text-sm text-muted-foreground mt-1">There was an error fetching the amenity list.</p>
      </div>
    );
  }

  const amenities = data ?? [];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Actions row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {amenities.length} amenit{amenities.length === 1 ? "y" : "ies"} in the global pool
        </p>
        <AmenityForm />
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {amenities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
            <div className="size-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <InboxIcon className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No amenities yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create your first global amenity. Hotel owners will be able to select from this list when setting up their properties.
            </p>
            <div className="mt-4">
              <AmenityForm />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 px-1 pb-4">
            {amenities.map((a) => (
              <AmenityCard key={a.id} amenity={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
