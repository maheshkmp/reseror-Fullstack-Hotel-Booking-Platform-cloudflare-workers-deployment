import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { InsertHotelNearbyPoiType } from "core/zod";
import { getClient } from "@/lib/rpc/client";

export const useAddHotelNearbyPois = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (pois: InsertHotelNearbyPoiType[]) => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      if (!targetHotelId) throw new Error("Hotel not found");

      const preparedPois = pois.map((poiText) => ({
        ...poiText,
        hotelId: targetHotelId as string
      }));

      const response = await rpcClient.api.hotels[":id"]["nearby-pois"].$post({
        param: { id: targetHotelId as string },
        json: preparedPois
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update nearby POIs");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Nearby POIs are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Nearby POIs updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "nearby-pois"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update nearby POIs", {
        id: toastId
      });
    }
  });

  return mutation;
};
