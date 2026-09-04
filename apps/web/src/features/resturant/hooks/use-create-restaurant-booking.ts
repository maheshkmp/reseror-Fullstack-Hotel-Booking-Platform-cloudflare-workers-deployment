import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RestaurantBookingInsert } from "core/zod";

export const useCreateRestaurantBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: RestaurantBookingInsert) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["restaurant-booking"].$post({
        json: input,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error((errorData as any).message || "Failed to create restaurant booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-bookings"] });
    },
  });
};
