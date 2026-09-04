import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePaymentAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["payments-admin"][":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        throw new Error("Failed to update admin payment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments-admin"] });
    },
  });
};
