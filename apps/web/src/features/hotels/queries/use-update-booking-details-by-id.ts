import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

export type UpdateBookingPayload = {
  hotelId: string;
  roomTypeId: string;
  roomsId: (string | null)[]; // array because your payload shows []
  guestName: string;
  paymentType: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  checkInDate: string | null; // ISO date string
  checkInTime: string | null; // ISO time string
  checkOutDate: string | null;
  checkOutTime: string | null;
  numRooms: number | null;
  numAdults: number | null;
  numChildren: number | null;
  totalAmount: number | null;
  commissionAmount: number | null;
  netPayableToHotel: number | null;
  currency: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests: string | null;
  notes: string | null;
  isPaid: boolean | null;
  paymentDetails: string | null;
};

export const useUpdateBookingDetailsByID = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateBookingPayload;
    }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["room-bookings"][id].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update booking details");
      }

      return response.json();
    },
  });
};
