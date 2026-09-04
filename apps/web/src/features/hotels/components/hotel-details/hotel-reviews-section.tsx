"use client";

import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  Quote, 
  Star, 
  ThumbsDown, 
  ThumbsUp, 
  User 
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { CreateReview } from "@/features/review/components/create-new-review";
import { useGetReviewsByHotelId } from "@/features/review/actions/use-get-review-by-hotel-id";
import { authClient } from "@/lib/auth-client";

interface HotelReviewsSectionProps {
  hotel: any;
}

const getRatingDisplay = (rating: string | number) => {
  const r = Number(rating);
  if (r >= 4.5) return { bg: "bg-slate-900", text: "Excellent", textColor: "text-slate-900" };
  if (r >= 4)   return { bg: "bg-slate-700", text: "Very Good", textColor: "text-slate-700" };
  if (r >= 3)   return { bg: "bg-slate-500", text: "Good",     textColor: "text-slate-500" };
  if (r >= 2)   return { bg: "bg-slate-400", text: "Fair",     textColor: "text-slate-400" };
  return         { bg: "bg-slate-300", text: "Poor",     textColor: "text-slate-400" };
};

const renderStars = (rating: string | number) => {
  const r = Number(rating);
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={cn(
        "w-3 h-3",
        i < Math.floor(r) ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"
      )}
    />
  ));
};

export function HotelReviewsSection({ hotel }: HotelReviewsSectionProps) {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const { data, isLoading } = useGetReviewsByHotelId({
    hotelId: hotel.id,
    page: 1,
    limit: 10,
  });

  const reviews = data?.data || [];

  return (
    <section id="reviews" className="scroll-mt-24 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-900">
          Guest Feedback
        </h2>
        <CreateReview hotelId={hotel.id} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="space-y-4">
             {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 w-full bg-slate-50 animate-pulse rounded-2xl" />
             ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review: any) => {
            const ratingInfo = getRatingDisplay(review.rating);
            const isOwnPendingReview = currentUserId && review.userId === currentUserId && !review.approvedAt;

            return (
              <div 
                key={review.id}
                className={cn(
                  "p-6 rounded-3xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100/50 hover:shadow-xl hover:shadow-slate-200/40 transition-all group",
                  isOwnPendingReview && "opacity-60 border-dashed bg-slate-50"
                )}
              >
                <div className="space-y-4">
                  {/* Header: User Info & Rating */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                          <User className="w-5 h-5 text-slate-400" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">Verified Guest</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                            {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Recently Reviewed"}
                          </p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                       <div className={cn("px-2.5 py-1 rounded-lg text-white text-xs font-bold shadow-lg shadow-slate-900/10", ratingInfo.bg)}>
                          {Number(review.rating).toFixed(1)}
                       </div>
                       <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-3 pl-0 md:pl-12">
                    {review.reviewTitle && (
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">"{review.reviewTitle}"</h4>
                    )}
                    
                    <div className="space-y-2.5">
                      {review.reviewPositiveText && (
                        <div className="flex gap-3 items-start">
                           <ThumbsUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                           <p className="text-[13px] text-slate-600 font-medium leading-relaxed italic">{review.reviewPositiveText}</p>
                        </div>
                      )}
                      {review.reviewNegativeText && (
                        <div className="flex gap-3 items-start">
                           <ThumbsDown className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                           <p className="text-[13px] text-slate-600 font-medium leading-relaxed italic">{review.reviewNegativeText}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Property Response */}
                  {review.propertyResponse && (
                    <div className="mt-6 pt-6 border-t border-slate-100 pl-0 md:pl-12">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                        <div className="flex gap-3">
                           <Quote className="w-4 h-4 text-slate-300 shrink-0" />
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Response from Property Manager</p>
                              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{review.propertyResponse}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
             <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <MessageSquare className="w-6 h-6 text-slate-300" />
             </div>
             <p className="text-slate-500 text-sm font-medium italic">Be the first to share your experience with this property.</p>
          </div>
        )}
      </div>
    </section>
  );
}
