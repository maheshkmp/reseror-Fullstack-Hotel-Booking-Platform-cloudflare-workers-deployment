import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { getClient } from "@/lib/rpc/client";

export const useAddHotelCommonAreas = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (areaTypes: { areaType: string }[]) => {
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

      const response = await rpcClient.api.hotels[":id"]["common-areas"].$post({
        param: { id: targetHotelId },
        json: areaTypes,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update common areas");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Common areas are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Common areas updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "common-areas"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update common areas", {
        id: toastId
      });
    }
  });

  return mutation;
};
