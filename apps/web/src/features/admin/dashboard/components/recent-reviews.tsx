"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewsProps {
  reviews: any[];
  isLoading?: boolean;
}

export function RecentReviews({ reviews, isLoading }: ReviewsProps) {
  return (
    <div
      className="rounded-2xl bg-white p-6"
      style={{ border: "1px solid #efefef" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Platform Feedback</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">The latest guest reviews</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <Star className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : reviews?.length > 0 ? (
          reviews.slice(0, 5).map((review: any, index: number) => (
            <div
              key={review.id || index}
              className="flex flex-col gap-3 p-4 bg-gray-50/20 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 border border-gray-200">
                    <AvatarFallback className="bg-white text-gray-900 font-bold text-[9px] uppercase">
                      {review.guestName?.charAt(0) || "G"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-xs text-gray-900 line-clamp-1">
                    {review.reviewTitle || "General Review"}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5",
                        i < (review.rating || 0)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-200 fill-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-gray-500 italic line-clamp-2 px-1 leading-relaxed">
                "{review.reviewNote || "No comment provided."}"
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Just recently"}
                </span>
                <span className="text-[9px] font-black text-gray-400 tracking-tighter uppercase px-1.5 py-0.5 bg-gray-100 rounded-md">
                  Verified
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-10 text-xs">
            No guest feedback found
          </div>
        )}
      </div>
    </div>
  );
}
