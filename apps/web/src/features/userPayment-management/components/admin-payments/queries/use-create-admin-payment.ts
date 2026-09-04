import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PaymentsAdminInsert } from "core/zod";

export function useCreateAdminPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PaymentsAdminInsert) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["admin-payments"].$post({
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
      toast.success("Admin payment record created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create admin payment");
    },
  });
}
