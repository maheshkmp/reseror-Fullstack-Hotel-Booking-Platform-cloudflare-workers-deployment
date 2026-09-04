"use client";

import React, { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Mail, Phone, CreditCard, Clock, MapPin, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BookingCalendarProps {
  bookings: any[];
}

export const BookingCalendar = ({ bookings }: BookingCalendarProps) => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const events = useMemo(() => {
    return bookings.map((booking) => {
      let color = "#71717a"; // Default zinc-500
      switch (booking.status) {
        case "confirmed":
          color = "#10b981"; // emerald-500
          break;
        case "pending":
          color = "#f59e0b"; // amber-500
          break;
        case "cancelled":
          color = "#ef4444"; // red-500
          break;
        case "checked_in":
          color = "#3b82f6"; // blue-500
          break;
        case "checked_out":
          color = "#6366f1"; // indigo-500
          break;
      }

      return {
        id: booking.id,
        title: booking.guestName || "Untitled Booking",
        start: booking.checkInDate,
        end: booking.checkOutDate,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          ...booking,
        },
      };
    });
  }, [bookings]);

  return (
    <div className="booking-calendar-container bg-white p-4 rounded-xl">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        events={events}
        height="auto"
        eventClick={(info) => {
          setSelectedBooking(info.event.extendedProps);
        }}
        eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
      />

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md bg-white border-zinc-200 p-0 overflow-hidden max-h-[86vh] flex flex-col">
          <DialogHeader className="p-6 pb-4 shrink-0 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={cn(
                "uppercase text-[10px] font-bold tracking-widest",
                selectedBooking?.status === 'confirmed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                selectedBooking?.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                selectedBooking?.status === 'cancelled' ? "bg-rose-50 text-rose-700 border-rose-200" :
                selectedBooking?.status === 'checked_in' ? "bg-blue-50 text-blue-700 border-blue-200" :
                selectedBooking?.status === 'checked_out' ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                "bg-zinc-50 text-zinc-700 border-zinc-200"
              )}>
                {selectedBooking?.status?.replace('_', ' ') || 'Pending'}
              </Badge>
              <span className="text-[10px] font-medium text-zinc-400 font-mono">
                #{selectedBooking?.id?.substring(0, 8)}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-zinc-900 mt-2 flex items-center gap-2">
              <User className="w-5 h-5 text-zinc-400" />
              {selectedBooking?.guestName}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-sm">
              Reservation Details
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Check In
                </p>
                <p className="text-sm font-semibold text-zinc-800">
                  {selectedBooking?.checkInDate}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Check Out
                </p>
                <p className="text-sm font-semibold text-zinc-800">
                  {selectedBooking?.checkOutDate}
                </p>
              </div>
            </div>

            <Separator className="bg-zinc-100" />

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-100 p-2 rounded-lg text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Guests</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {selectedBooking?.numAdults || 0} Adults 
                    {selectedBooking?.numChildren > 0 && ` · ${selectedBooking.numChildren} Children`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-zinc-100 p-2 rounded-lg text-zinc-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rooms</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {selectedBooking?.rooms?.length || selectedBooking?.numRooms || 1} Room(s)
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-100" />

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <CreditCard className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment & Total</p>
                    <p className="text-sm font-bold text-zinc-900">
                      {selectedBooking?.currency} {Number(selectedBooking?.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white text-[10px] border-zinc-200">
                  {selectedBooking?.paymentType || 'CASH'}
                </Badge>
              </div>

              {selectedBooking?.specialRequests && (
                <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Hash className="w-3 h-3" /> Special Requests
                  </p>
                  <p className="text-xs text-zinc-600 leading-relaxed italic">
                    "{selectedBooking.specialRequests}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 text-xs font-bold uppercase tracking-wider h-11 border-zinc-200 hover:bg-zinc-50"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>
              <Button 
                className="flex-1 text-xs font-bold uppercase tracking-wider h-11 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-200"
                onClick={() => window.location.href = '/account/manage/booking-details'}
              >
                View Management
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <style jsx global>{`
        .fc {
          --fc-border-color: #e4e4e7;
          --fc-button-bg-color: #113c86ff;
          --fc-button-border-color: #18181b;
          --fc-button-hover-bg-color: #27272a;
          --fc-button-hover-border-color: #27272a;
          --fc-button-active-bg-color: #3f3f46;
          --fc-button-active-border-color: #3f3f46;
          --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.1);
          --fc-more-link-text-color: #18181b;
          --fc-event-text-color: #fff;
          font-family: inherit;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #18181b;
        }
        .fc .fc-button {
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active, 
        .fc .fc-button-primary:not(:disabled):active {
           background-color: #289860ff;
           border-color: #289860ff;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border: 1px solid #f4f4f5;
        }
        .fc .fc-col-header-cell-cushion {
          padding: 10px 0;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717a;
        }
        .fc-daygrid-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
