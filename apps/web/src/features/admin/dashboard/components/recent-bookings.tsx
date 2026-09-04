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
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingsProps {
  bookings: any[];
  isLoading?: boolean;
}

export function RecentBookings({ bookings, isLoading }: BookingsProps) {
  return (
    <div 
      className="rounded-2xl bg-white p-6"
      style={{ border: "1px solid #efefef" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Recent Bookings</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Late-breaking platform activity</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : bookings?.length > 0 ? (
          bookings.slice(0, 5).map((booking: any, index: number) => (
            <div
              key={booking.id || index}
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/20 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-gray-200">
                  <AvatarFallback className="bg-white text-gray-900 font-bold text-[10px] uppercase">
                    {booking.guestName?.charAt(0) || "G"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-xs text-gray-900">
                    {booking.guestName || "Anonymous Guest"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Booking " + (booking.id?.slice(-6) || "N/A")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <p className="text-xs font-bold text-gray-900">
                  ${Number(booking.totalAmount || 0).toLocaleString()}
                </p>
                <span
                  className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-full",
                    booking.status === "confirmed"
                      ? "bg-emerald-50 text-emerald-600"
                      : booking.status === "pending"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600"
                  )}
                >
                  {booking.status?.toUpperCase() || "PENDING"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-10 text-xs">
            No recent activity found
          </div>
        )}
      </div>
    </div>
  );
}
