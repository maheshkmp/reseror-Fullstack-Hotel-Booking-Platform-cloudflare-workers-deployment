import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaymentsHotelInsert } from "core/zod";

export function useCreateHotelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PaymentsHotelInsert) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["payments-hotel"].$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to create hotel payment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotel-payments"] });
    },
    onError: (error) => {
      console.error("Hotel payment creation failed:", error);
    },
  });
}
