import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateUserPaymentParams {
  id: string;
  data: {
    proof?: string;
    referenceId?: string;
    status?: string | any;
    paid?: boolean;
    paidAt?: Date | string;
    bankName?: string;
    rejectionReason?: string;
  };
}

export const useUpdateUserPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateUserPaymentParams) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api["payments-hotel"][":id"].$patch({
        param: { id },
        json: data as any,
      });

      if (!response.ok) {
        throw new Error("Failed to update payment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments-admin"] });
    },
  });
};
