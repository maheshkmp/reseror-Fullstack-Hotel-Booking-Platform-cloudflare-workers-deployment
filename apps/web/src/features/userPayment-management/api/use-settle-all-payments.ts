import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSettleAllPayments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { hotelId?: string }) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api["payments-hotel"]["settle-all"].$post({
        json: {
          hotelId: params.hotelId,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error((error as any).message || "Failed to settle payments");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userPayments"] });
      queryClient.invalidateQueries({ queryKey: ["roomBookings"] });
      queryClient.invalidateQueries({ queryKey: ["roomBookingsStats"] });
      toast.success(data.message || `Successfully settled ${data.settledCount} commissions.`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
