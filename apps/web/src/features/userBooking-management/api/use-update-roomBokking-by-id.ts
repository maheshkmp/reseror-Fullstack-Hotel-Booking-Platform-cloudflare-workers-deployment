import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateRoomBookingSchema } from "core/zod/roomBooking.schema";

export const useUpdateRoomBookingById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRoomBookingSchema;
    }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["room-bookings"][":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update room booking");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate room bookings queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["roomBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allRoomBookings"] });
    },
  });
};
