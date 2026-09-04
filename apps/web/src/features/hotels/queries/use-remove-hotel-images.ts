import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

export const useRemoveHotelImages = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (imageId: string) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels.images[imageId].$delete();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove hotel image");
      }

      return true;
    },
    onMutate: () => {
      toast.loading("Removing hotel image...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Hotel image removed successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "images", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["hotels", "room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove hotel image", {
        id: toastId,
      });
    },
  });

  return mutation;
};
