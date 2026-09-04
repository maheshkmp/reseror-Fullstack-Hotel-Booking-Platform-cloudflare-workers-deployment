import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { getClient } from "@/lib/rpc/client";

export const useAddHotelPaymentMethods = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (cardTypes: { cardType: string }[]) => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      if (!targetHotelId) throw new Error("Hotel not found");

      const response = await rpcClient.api.hotels[":id"]["payment-methods"].$post({
        param: { id: targetHotelId },
        json: cardTypes,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update accepted payment methods");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Accepted payment methods are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Accepted payment methods updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "payment-methods"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update accepted payment methods", {
        id: toastId
      });
    }
  });

  return mutation;
};
