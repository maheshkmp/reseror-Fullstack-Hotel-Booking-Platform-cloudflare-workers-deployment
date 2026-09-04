"use client";

import RoomBookingForm from "@/features/roomBookings/components/room-booking-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/modules/layouts/navbar";
import { Footer } from "@/modules/layouts/footer";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelId = searchParams.get("hotelId");
  const roomTypeId = searchParams.get("roomTypeId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/signin?callbackUrl=${encodeURIComponent(currentUrl)}`);
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!session) return null; // Wait for redirect

  const handleSuccess = () => {
    // router.push("/account/booking-details");
  };

  const handleClose = () => {
    router.back();
  };

  const initialStayData = {
    checkInDate: checkIn || undefined,
    checkOutDate: checkOut || undefined,
    numAdults: adults ? parseInt(adults) : undefined,
    numChildren: children ? parseInt(children) : undefined,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      
      <main className="flex-1 relative py-12 px-4 sm:px-6 lg:px-8">
        {/* Dynamic Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[140px] -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/[0.03] rounded-full blur-[140px] translate-y-1/3 -translate-x-1/4" />
        </div>

        {!hotelId || !roomTypeId ? (
          <div className="relative max-w-md mx-auto text-center space-y-6 pt-12 min-h-[50vh] flex flex-col justify-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
               <ArrowLeft size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              Oops! Missing selection details
            </h1>
            <p className="text-slate-500">
              It seems you haven't selected a room yet. Let's get you back to the search results.
            </p>
            <Button onClick={() => router.push("/search")} className="rounded-2xl h-12 px-8">
               <Home className="mr-2 w-4 h-4" /> Return to Search
            </Button>
          </div>
        ) : (
          <div className="relative max-w-7xl mx-auto">
            <RoomBookingForm
              hotelId={hotelId}
              roomTypeId={roomTypeId}
              initialStayData={initialStayData}
              onSuccess={handleSuccess}
              onClose={handleClose}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Preparing your booking...</p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
