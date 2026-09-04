import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomBookingById = (id: string) => {
  return useQuery({
    queryKey: ["roomBooking", id],
    queryFn: async () => {
      if (!id) throw new Error("Booking ID is required");
      
      const rpcClient = await getClient();
      const res = await rpcClient.api["room-bookings"][":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch room booking");
      }

      return await res.json();
    },
    enabled: !!id,
  });
};
