import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { InsertHotelSustainabilityType } from "core/zod";
import { getClient } from "@/lib/rpc/client";

export const useAddHotelSustainability = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (sustainability: InsertHotelSustainabilityType[]) => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      if (!targetHotelId) throw new Error("Hotel not found");

      const response = await rpcClient.api.hotels[":id"]["sustainability"].$post({
        param: { id: targetHotelId },
        json: sustainability,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update sustainability initiatives");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Sustainability initiatives are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Sustainability initiatives updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "sustainability"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update sustainability initiatives", {
        id: toastId
      });
    }
  });

  return mutation;
};
