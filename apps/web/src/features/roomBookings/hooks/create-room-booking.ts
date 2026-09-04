import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

export interface CreateRoomBookingInput {
  hotelId: string;
  roomTypeId: string;
  guestName: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  checkInDate?: string | null;
  checkInTime?: string | null;
  checkOutDate?: string | null;
  checkOutTime?: string | null;
  numRooms?: number | null;
  numAdults?: number | null;
  numChildren?: number | null;
  totalAmount?: string | null;
  commissionAmount?: string | null;
  netPayableToHotel?: string | null;
  currency?: string | null;
  paymentType?: string | null;
  specialRequests?: string | null;
  notes?: string | null;
  isPaid?: boolean | null;
  status?: string | null;
  paymentDetails?: any;
  rooms?: string[] | null;
  promoCode?: string | null;
  discountAmount?: string | null;
  influencerId?: string | null;
  browserFingerprint?: string | null;
}

export const useCreateRoomBooking = () => {
  return useMutation({
    mutationFn: async (input: CreateRoomBookingInput) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["room-bookings"].$post({
        json: input,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create room booking");
      }
      return res.json();
    },
  });
};
