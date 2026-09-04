"use client";

import RoomBookingForm from "@/features/roomBookings/components/room-booking-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelId = searchParams.get("hotelId");
  const roomTypeId = searchParams.get("roomTypeId");

  if (!hotelId || !roomTypeId) {
    return (
      <div className="min-h-screen/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Invalid Booking Request
          </h1>
          <p className="text-gray-600">
            Missing hotel or room type information.
          </p>
          <Button onClick={() => router.push("/account/hotels")}>
            Go Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    // router.push("/account/booking-details");
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="py-8">
      <RoomBookingForm
        hotelId={hotelId}
        roomTypeId={roomTypeId}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    </div>
  );
}

export default function BookRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading booking form...</p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
