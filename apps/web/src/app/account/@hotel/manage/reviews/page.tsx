"use client";

import { useGetMyHotel } from "@/features/hotels/api/use-get-my-hotel";
import { useGetReviewsByHotelId } from "@/features/review/actions/use-get-review-by-hotel-id";
import { useDeleteReview } from "@/features/review/actions/use-delete-review";
import { useUpdateReview } from "@/features/review/actions/use-update-review";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  StarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  Trash2Icon,
  ClockIcon,
  MessageSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
} from "lucide-react";

// ─── Star renderer ────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon
          key={s}
          className={cn(
            "w-3.5 h-3.5",
            s <= rating ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"
          )}
        />
      ))}
    </span>
  );
}

// ─── Rating badge ─────────────────────────────────────────────────────────────
function RatingBadge({ rating }: { rating: number }) {
  const cfg =
    rating >= 4
      ? "bg-green-50 text-green-700 border-green-200"
      : rating >= 3
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : "bg-red-50 text-red-700 border-red-200";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-bold border px-2 py-0.5 rounded-full", cfg)}>
      <StarIcon className="w-3 h-3 fill-current" />
      {rating} / 5
    </span>
  );
}

// ─── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ approvedAt }: { approvedAt: string | null }) {
  return approvedAt ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
      <CheckCircleIcon className="w-3 h-3" /> Approved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
      <ClockIcon className="w-3 h-3" /> Pending
    </span>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function ReviewSkeleton() {
  return (
    <div className="border border-zinc-100 rounded-xl p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-2.5 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-2/3 rounded" />
      <Skeleton className="h-10 w-full rounded" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="ml-auto h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({
  review,
  onApprove,
  onReject,
  onDelete,
  isPending,
}: {
  review: any;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  const isApproved = !!review.approvedAt;
  const initials = (review.user?.name || review.userId || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div
      className={cn(
        "group border rounded-xl p-5 transition-all duration-200 bg-white",
        isApproved ? "border-zinc-200" : "border-yellow-200 bg-yellow-50/30"
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              {review.user?.name || `User ${review.userId?.slice(0, 6)}`}
            </p>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
              <ClockIcon className="w-3 h-3" />
              {review.reviewDate
                ? new Date(review.reviewDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <StatusPill approvedAt={review.approvedAt} />
          {review.rating && <RatingBadge rating={Number(review.rating)} />}
        </div>
      </div>

      {/* Title & stars */}
      {(review.reviewTitle || review.rating) && (
        <div className="mt-4 flex items-center gap-3">
          {review.rating && <Stars rating={Number(review.rating)} />}
          {review.reviewTitle && (
            <h4 className="text-sm font-bold text-zinc-800 leading-tight">
              &ldquo;{review.reviewTitle}&rdquo;
            </h4>
          )}
        </div>
      )}

      {/* Review text */}
      <div className="mt-3 space-y-2">
        {review.reviewPositiveText && (
          <div className="flex gap-2 items-start">
            <span className="shrink-0 mt-0.5">
              <ThumbsUpIcon className="w-3.5 h-3.5 text-green-600" />
            </span>
            <p className="text-xs text-zinc-700 leading-relaxed">{review.reviewPositiveText}</p>
          </div>
        )}
        {review.reviewNegativeText && (
          <div className="flex gap-2 items-start">
            <span className="shrink-0 mt-0.5">
              <ThumbsDownIcon className="w-3.5 h-3.5 text-red-500" />
            </span>
            <p className="text-xs text-zinc-700 leading-relaxed">{review.reviewNegativeText}</p>
          </div>
        )}
        {review.response && (
          <div className="flex gap-2 items-start bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 mt-2">
            <MessageSquareIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-600 italic">{review.response}</p>
          </div>
        )}
        {!review.reviewPositiveText && !review.reviewNegativeText && (
          <p className="text-xs text-zinc-400 italic mt-2">No review text provided.</p>
        )}
      </div>

      {/* Action row */}
      <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-2 flex-wrap">
        {!isApproved ? (
          <Button
            size="sm"
            onClick={onApprove}
            disabled={isPending}
            className="h-8 px-3 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white border-0 shadow-none rounded-lg gap-1.5"
          >
            <CheckCircleIcon className="w-3.5 h-3.5" />
            Approve
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            disabled={isPending}
            className="h-8 px-3 text-xs font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-100 shadow-none rounded-lg gap-1.5"
          >
            <XCircleIcon className="w-3.5 h-3.5 text-red-500" />
            Revoke
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={onDelete}
          disabled={isPending}
          className="h-8 px-3 text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50 shadow-none rounded-lg gap-1.5 ml-auto"
        >
          <Trash2Icon className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: hotelData, isLoading: isLoadingHotel } = useGetMyHotel();
  const hotelId = hotelData?.id || hotelData?.hotel?.id;

  const { data, isLoading, isError, error } = useGetReviewsByHotelId({
    hotelId: hotelId ?? "",
    page,
    limit: 10,
  });

  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();

  const isPending = isDeleting || isUpdating;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["reviews-by-hotel"] });

  const handleApprove = (id: string) =>
    updateReview(
      { id, data: { propertyResponse: "approved" } as any },
      {
        onSuccess: () => {
          toast.success("Review approved and published.");
          invalidate();
        },
        onError: (e: any) => toast.error(e.message || "Failed to approve."),
      }
    );

  const handleReject = (id: string) =>
    updateReview(
      { id, data: { propertyResponse: "" } as any },
      {
        onSuccess: () => {
          toast.success("Review revoked.");
          invalidate();
        },
        onError: (e: any) => toast.error(e.message || "Failed to revoke."),
      }
    );

  const handleDelete = (id: string) =>
    deleteReview(id, {
      onSuccess: () => {
        toast.success("Review deleted.");
        invalidate();
      },
      onError: (e: any) => toast.error(e.message || "Failed to delete."),
    });

  const reviews = data?.data || [];
  const total = data?.meta?.totalCount ?? 0;

  // ─ Loading skeleton ─
  if (isLoadingHotel || isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-4">
        <div className="mb-6">
          <Skeleton className="h-7 w-40 rounded mb-2" />
          <Skeleton className="h-4 w-56 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ─ No hotel ─
  if (!hotelId) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <InboxIcon className="w-7 h-7 text-zinc-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-800">No hotel found</h3>
        <p className="text-sm text-zinc-500 mt-1">Complete your hotel setup to see reviews here.</p>
      </div>
    );
  }

  // ─ Error ─
  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <XCircleIcon className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-800">Failed to load reviews</h3>
        <p className="text-sm text-red-500 mt-1">{(error as any)?.message || "Something went wrong."}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Guest Reviews</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage, approve, or remove reviews submitted for your property.
          </p>
        </div>
        {total > 0 && (
          <span className="text-xs font-semibold text-zinc-500 border border-zinc-200 bg-zinc-50 rounded-full px-3 py-1">
            {total} review{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Stats strip */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Total",
              value: total,
              color: "text-zinc-900",
              bg: "bg-zinc-50 border-zinc-100",
            },
            {
              label: "Approved",
              value: reviews.filter((r: any) => r.approvedAt).length,
              color: "text-green-700",
              bg: "bg-green-50 border-green-100",
            },
            {
              label: "Pending",
              value: reviews.filter((r: any) => !r.approvedAt).length,
              color: "text-yellow-700",
              bg: "bg-yellow-50 border-yellow-100",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={cn("border rounded-xl px-4 py-3 text-center", s.bg)}
            >
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center border border-dashed border-zinc-200 rounded-xl py-16">
          <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquareIcon className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-base font-bold text-zinc-700">No reviews yet</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-xs">
            Reviews from your guests will appear here once submitted.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <ReviewCard
              key={review.id}
              review={review}
              onApprove={() => handleApprove(review.id)}
              onReject={() => handleReject(review.id)}
              onDelete={() => handleDelete(review.id)}
              isPending={isPending}
            />
          ))}

          {/* Pagination */}
          {total > 10 && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-2">
              <span className="text-xs text-zinc-400">
                Page {page} of {Math.ceil(total / 10)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || isPending}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-8 px-3 text-xs border-zinc-200 rounded-lg shadow-none gap-1"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(total / 10) || isPending}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-3 text-xs border-zinc-200 rounded-lg shadow-none gap-1"
                >
                  Next <ChevronRightIcon className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
