"use client";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  ExternalLinkIcon,
  HomeIcon,
  LinkIcon,
  MapPinIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useId } from "react";
import { useDeleteAd } from "../actions/use-delete-ad";
import type { ad } from "core/zod";
import EditAdDialog from "./edit-ad-dialog";

interface Props {
  ad: ad;
}

function toStr(val: any) {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

export function AdCard({ ad }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteAd = useDeleteAd();

  // Default image if none provided
  const displayImage = toStr(ad.imageUrl);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAd.mutateAsync(toStr(ad.id));
      toast.success("Ad deleted successfully");
    } catch (error) {
      console.error("Failed to delete ad:", error);
      toast.error("Failed to delete ad");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        key={id}
        className="transition-all hover:shadow-lg border-l-4 border-l-blue-500 p-4"
      >
        <div className="flex items-center gap-4">
          {/* Avatar section */}
          <Avatar className="h-16 w-16 rounded-full border">
            <AvatarImage
              src={displayImage}
              alt={toStr(ad.title)}
              className="size-16"
            />
            <AvatarFallback className="bg-blue-50 text-blue-700">
              <HomeIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">
                  {toStr(ad.title)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Added{" "}
                  {ad.createdAt
                    ? formatDistanceToNow(new Date(toStr(ad.createdAt)))
                    : "recently"}{" "}
                  ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {ad.hotelId && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-sm truncate max-w-[180px]">
                    Hotel: {toStr(ad.hotelId)}
                  </span>
                </div>
              )}
              {ad.roomId && (
                <span className="text-xs text-muted-foreground">
                  | Room: {toStr(ad.roomId)}
                </span>
              )}
              {ad.restaurantId && (
                <span className="text-xs text-muted-foreground">
                  | Restaurant: {toStr(ad.restaurantId)}
                </span>
              )}
              {ad.placement && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Placement: {toStr(ad.placement)}</span>
                </>
              )}
              {ad.priority && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Priority: {toStr(ad.priority)}</span>
                </>
              )}
              {ad.isActive !== undefined && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <Badge variant={ad.isActive ? "secondary" : "outline"}>
                    {ad.isActive ? "Active" : "Inactive"}
                  </Badge>
                </>
              )}
              {ad.startDate && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>
                    <CalendarIcon className="h-3.5 w-3.5 text-blue-500 inline" />{" "}
                    Start: {toStr(ad.startDate)}
                  </span>
                </>
              )}
              {ad.endDate && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>
                    <CalendarIcon className="h-3.5 w-3.5 text-blue-500 inline" />{" "}
                    End: {toStr(ad.endDate)}
                  </span>
                </>
              )}
              {ad.redirectUrl && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-3.5 w-3.5 text-teal-500" />
                    <a
                      href={toStr(ad.redirectUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline truncate max-w-[180px] text-sm"
                    >
                      {toStr(ad.redirectUrl)}
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Promo & Usage Info */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100">
              {(ad as any).promoCode && (
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                    {(ad as any).promoCode}
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    {(ad as any).discountPercent}% OFF
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="text-slate-900 font-bold">{(ad as any).usageCount || 0}</span>
                <span>/ {(ad as any).usageLimit || "∞"} used</span>
              </div>

              <div className="flex gap-1">
                {(ad as any).isUniquePerUser && (
                  <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-bold uppercase border-amber-200 bg-amber-50 text-amber-700">
                    Unique
                  </Badge>
                )}
                {(ad as any).minBookingValue && Number((ad as any).minBookingValue) > 0 && (
                  <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-bold uppercase border-blue-200 bg-blue-50 text-blue-700">
                    Min: ${(ad as any).minBookingValue}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-xs w-fit"
            >
              {ad.isActive ? "Active" : "Inactive"}
            </Badge>

            {/* Add Edit button */}
            <EditAdDialog ad={ad} />

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8 px-2">
              <Link href={`/admin/ad-management/${toStr(ad.id)}`}>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the ad "{toStr(ad.title)}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Ad"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
