import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { InsertHotelSafetyType } from "core/zod";
import { getClient } from "@/lib/rpc/client";

export const useAddHotelSafety = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (safetyFeatures: InsertHotelSafetyType[]) => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) {
          throw new Error("Failed to fetch my hotel");
        }
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      if (!targetHotelId) throw new Error("Hotel not found");

      const preparedSafety = safetyFeatures.map((feature) => ({
        ...feature,
        hotelId: targetHotelId as string,
      }));

      const response = await rpcClient.api.hotels[":id"]["safety"].$post({
        param: { id: targetHotelId as string },
        json: preparedSafety,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update health & safety features");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Health & safety features are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Health & safety features updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "safety"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update health & safety features", {
        id: toastId
      });
    }
  });

  return mutation;
};
