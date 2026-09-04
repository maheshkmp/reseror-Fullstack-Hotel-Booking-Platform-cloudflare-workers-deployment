"use client";

import { format } from "date-fns";
import {
  CalendarDays,MapPin, Building, BedDouble, Info, Mail, Phone, Printer, Download, FileText, ChevronRight, BadgeCheck, Users, Bed } from "lucide-react";
import { useGetRoomBookingById } from "../actions/use-get-room-booking-by-id";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface RoomBookingSummaryProps {
  bookingId: string;
  bookingData?: any;
}

export default function RoomBookingSummary({
  bookingId,
  bookingData: passedBookingData,
}: RoomBookingSummaryProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userRole = session?.user?.role;

  const {
    data: fetchedBookingData,
    isLoading,
    error,
  } = useGetRoomBookingById(bookingId);

  const bookingData = passedBookingData || fetchedBookingData;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // For a minimalist approach, we trigger the system print dialog which 
    // allows saving as PDF, ensuring the "designed" look is preserved.
    window.print();
  };

  if (!passedBookingData && isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-normal">Finalizing your stay...</p>
      </div>
    );
  }

  if (!passedBookingData && (error || !bookingData)) {
    return (
      <div className="p-20 text-center space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">Booking not found</h3>
        <p className="text-sm text-slate-500 font-normal max-w-xs mx-auto">We couldn't retrieve these details. Please check your reference ID.</p>
        <Button variant="link" onClick={() => window.location.reload()} className="text-slate-900 font-semibold">Try Again</Button>
      </div>
    );
  }

  const booking = passedBookingData || bookingData || {};
  const hotel = booking.hotel || {};
  const roomType = booking.roomType || {};

  const formatAmount = (amount?: string | number) => {
    if (!amount) return "—";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return `${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${booking.currency || "USD"}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto py-6 px-8 bg-white print:p-0"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8 underline-offset-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-600">
            <BadgeCheck size={24} strokeWidth={1.5} />
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Reservation Confirmed</h1>
          </div>
          <p className="text-sm text-slate-500 font-normal leading-relaxed max-w-md">
            Your stay at <span className="font-semibold text-slate-900">{hotel.name || booking.hotelName || "the property"}</span> is locked in. A confirmation email has been sent to {booking.guestEmail}.
          </p>
        </div>
        
        <div className="flex gap-4 print:hidden">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Download size={14} /> Download
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="space-y-8">
        
        {/* Stay Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Schedule</span>
              <div className="flex items-center gap-3 text-slate-900 font-semibold">
                <span>{booking.checkInDate ? format(new Date(booking.checkInDate), "MMM dd, yyyy") : "—"}</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span>{booking.checkOutDate ? format(new Date(booking.checkOutDate), "MMM dd, yyyy") : "—"}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><BedDouble size={14} /> Accommodation</span>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <p className="text-sm text-slate-900 font-bold">{roomType.name || booking.roomTypeName || "Standard Room"}</p>
                {roomType.description && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{roomType.description}</p>
                )}
                
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    <Users size={12} className="text-slate-400" /> 
                    {booking.numAdults} Adult(s) {booking.numChildren ? `• ${booking.numChildren} Child(ren)` : ''}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    <Bed size={12} className="text-slate-400" /> 
                    {booking.numRooms} Room(s)
                  </div>
                  {roomType.roomSizeSqm && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                       {roomType.roomSizeSqm} m²
                    </div>
                  )}
                  {roomType.viewType && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 capitalize">
                       {roomType.viewType} View
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Building size={14} /> Property Details</span>
              <div className="p-4 border border-slate-100 rounded-xl space-y-2">
                <p className="text-sm font-bold text-slate-900">{hotel.name || "Hotel details not available"}</p>
                {hotel.formattedAddress && (
                  <div className="flex items-start gap-2 text-xs text-slate-500 mt-1">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-emerald-600" /> 
                    <span>{hotel.formattedAddress}</span>
                  </div>
                )}
                {(hotel.phone || hotel.email) && (
                  <div className="pt-2 mt-2 border-t border-slate-50 flex flex-col gap-1.5">
                    {hotel.phone && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={12} className="text-slate-400" /> {hotel.phone}
                      </div>
                    )}
                    {hotel.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} className="text-slate-400" /> {hotel.email}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Guest Info</span>
              <p className="text-base text-slate-900 font-semibold">{booking.guestName}</p>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-normal">
                  <Mail size={14} strokeWidth={1.5} /> {booking.guestEmail}
                </div>
                {booking.guestPhone && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-normal">
                    <Phone size={14} strokeWidth={1.5} /> {booking.guestPhone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Financials & Status */}
        <section className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total Amount</span>
            <div className="flex flex-col">
              <span className="text-3xl font-semibold text-slate-900 tracking-tighter">
                {formatAmount(booking.totalAmount)}
              </span>
              <span className="text-xs text-slate-500 font-normal mt-1">
                Payable {booking.paymentType === "cash" ? "at counter upon arrival" : "online"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-6 w-full md:w-auto">
            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider">
                Confirmed
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => {
                if (userRole === "user") {
                  router.push("/account?tab=bookings");
                } else {
                  router.push("/account/booking-details");
                }
              }}
              className="h-10 px-6 rounded-full border-slate-200 text-slate-900 font-semibold text-xs hover:bg-slate-50 transition-all print:hidden"
            >
              Go to my bookings
            </Button>
          </div>
        </section>

        {/* Special Instructions */}
        {booking.specialRequests && (
          <section className="space-y-3 pt-3">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} strokeWidth={1.5} /> Special Instructions
            </span>
            <p className="text-sm text-slate-500 font-normal leading-relaxed italic">
              "{booking.specialRequests}"
            </p>
          </section>
        )}
      </div>

      <footer className="mt-4 pt-5 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-500 font-normal uppercase tracking-[0.2em]">
          Reference ID: {bookingId}
        </p>
        <p className="text-xs text-slate-400 font-normal mt-2 underline transition-colors cursor-pointer hover:text-slate-600 print:hidden">
          info@reseror.com
        </p>
      </footer>
    </motion.div>
  );
}
