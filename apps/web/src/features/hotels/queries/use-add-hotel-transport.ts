import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { InsertHotelTransportType } from "core/zod";
import { getClient } from "@/lib/rpc/client";

export const useAddHotelTransport = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (transport: InsertHotelTransportType[]) => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      if (!targetHotelId) throw new Error("Hotel not found");

      const response = await rpcClient.api.hotels[":id"]["transport"].$post({
        param: { id: targetHotelId },
        json: transport,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update transport & parking specifics");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Transport & parking specifics are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Transport & parking specifics updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "transport"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update transport & parking specifics", {
        id: toastId
      });
    }
  });

  return mutation;
};
