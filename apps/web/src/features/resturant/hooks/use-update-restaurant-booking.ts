import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateRestaurantBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "arrived" | "no_show" | "refunded" }) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["restaurant-booking"][":id"].status.$patch({
        param: { id },
        json: { status },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error((errorData as any).message || "Failed to update booking status");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-bookings"] });
    },
  });
};
