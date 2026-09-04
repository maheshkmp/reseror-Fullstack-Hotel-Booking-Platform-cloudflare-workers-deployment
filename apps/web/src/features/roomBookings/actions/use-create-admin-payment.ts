import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaymentsAdminInsert } from "core/zod";

export function useCreateAdminPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PaymentsAdminInsert) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["payments-admin"].$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to create admin payment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
    },
    onError: (error) => {
      console.error("Admin payment creation failed:", error);
    },
  });
}
