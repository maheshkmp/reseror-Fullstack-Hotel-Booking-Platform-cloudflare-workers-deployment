"use client";

import { useGetMyHotel } from "@/features/hotels/queries/use-update-hotel-by-id";
import { useGetRoomBookings } from "@/features/roomBookings/actions/get-room-booking";
import { BookingCalendar } from "@/features/roomBookings/components/BookingCalendar";
import { Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { useMemo } from "react";

export default function CalendarPage() {
  const { data: myHotel, isLoading: hotelLoading } = useGetMyHotel();
  const hotelId = myHotel?.id ?? null;

  const { data: roomBookingsData, isLoading: roomBookingsLoading } =
    useGetRoomBookings({
      page: 1,
      limit: 500,
      hotelId: hotelId || "no-hotel-id",
    });

  const bookings = useMemo(() => {
    if (!roomBookingsData?.data || !hotelId) return [];
    const seen = new Set();
    return roomBookingsData.data.filter((b: any) => {
      if (seen.has(b.id)) return false;
      seen.add(b.id);
      return b.hotelId === hotelId;
    });
  }, [roomBookingsData, hotelId]);

  if (hotelLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!hotelId) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-amber-900 mb-2">No Hotel Linked</h2>
          <p className="text-amber-700 text-sm">
            This account is not currently linked to any hotel property.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            Booking Calendar
          </h1>
          <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {myHotel?.name} · {bookings.length} bookings
          </p>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex flex-wrap gap-x-5 gap-y-1.5">
          {[
            { color: "bg-emerald-500", label: "Confirmed" },
            { color: "bg-amber-500", label: "Pending" },
            { color: "bg-rose-500", label: "Cancelled" },
            { color: "bg-blue-500", label: "Checked In" },
            { color: "bg-indigo-500", label: "Checked Out" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-widest">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Full-screen calendar body */}
      <div className="flex-1 overflow-auto bg-zinc-50 p-4">
        {roomBookingsLoading ? (
          <div className="flex h-full min-h-[500px] items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-1 h-full min-h-[600px]">
            <BookingCalendar bookings={bookings} />
          </div>
        )}
      </div>
    </div>
  );
}
