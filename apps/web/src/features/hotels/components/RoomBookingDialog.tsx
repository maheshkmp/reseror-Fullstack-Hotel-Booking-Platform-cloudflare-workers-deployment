"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface RoomBookingDialogProps {
  hotelId: string;
  roomTypeId: string;
}

export default function RoomBookingDialog({
  hotelId,
  roomTypeId,
}: RoomBookingDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoCode = searchParams?.get("promoCode");

  const handleBookRoom = () => {
    // Navigate to the account booking page, preserving any promo code from the URL
    const baseUrl = `/book-room?hotelId=${hotelId}&roomTypeId=${roomTypeId}`;
    const targetUrl = promoCode 
      ? `${baseUrl}&promoCode=${encodeURIComponent(promoCode)}`
      : baseUrl;
      
    router.push(targetUrl);
  };

  return (
    <Button className="w-full md:w-auto bg-blue-950" onClick={handleBookRoom}>
      Select Room
    </Button>
  );
}
