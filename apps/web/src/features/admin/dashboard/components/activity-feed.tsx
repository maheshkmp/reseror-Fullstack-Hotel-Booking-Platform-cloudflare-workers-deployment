"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  title: string;
  timestamp: string;
  type: "booking" | "review" | "article" | "property" | "user";
  color: string;
}

function ActivityItem({ title, timestamp, type, color }: ActivityItemProps) {
  return (
    <div className="group relative flex gap-x-4 pb-4">
      <div className="absolute left-0 top-0 flex w-4 justify-center -bottom-4">
        <div className="w-px bg-gray-100" />
      </div>

      <div className="relative flex h-4 w-4 flex-none items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
        <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
      </div>

      <div className="flex-auto p-3 rounded-xl border border-gray-100 bg-gray-50/20 hover:bg-white transition-all duration-200">
        <div className="flex justify-between items-start gap-3">
          <p className="text-[11px] font-bold text-gray-800 leading-relaxed">{title}</p>
          <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-white border border-gray-100 rounded text-gray-400 shrink-0">
            {type}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Clock className="w-2.5 h-2.5 text-gray-300" />
          <time className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{timestamp}</time>
        </div>
      </div>
    </div>
  );
}

interface ActivityFeedProps {
  bookings: any[];
  reviews: any[];
  articles: any[];
  restaurants: any[];
  users: any[];
  isLoading?: boolean;
}

export function ActivityFeed({
  bookings,
  reviews,
  articles,
  restaurants,
  users,
  isLoading,
}: ActivityFeedProps) {
  return (
    <div
      className="rounded-2xl bg-white p-6"
      style={{ border: "1px solid #efefef" }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Live Updates</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Real-time platform events</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <Activity className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-1">
            {bookings?.slice(0, 2).map((booking: any, index: number) => (
              <ActivityItem
                key={`booking-${index}`}
                title={`Reservation confirmed #${booking.id?.slice(-6) || "N/A"}`}
                timestamp={booking.createdAt ? new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                type="booking"
                color="text-gray-400"
              />
            ))}

            {reviews?.slice(0, 2).map((review: any, index: number) => (
              <ActivityItem
                key={`review-${index}`}
                title={`Guest left a ${review.rating}/5 star review`}
                timestamp={review.createdAt ? new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                type="review"
                color="text-gray-400"
              />
            ))}

            {users?.slice(0, 2).map((user: any, index: number) => (
              <ActivityItem
                key={`user-${index}`}
                title={`New explorer joined: ${user.name || user.email}`}
                timestamp={user.createdAt ? new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                type="user"
                color="text-gray-400"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
