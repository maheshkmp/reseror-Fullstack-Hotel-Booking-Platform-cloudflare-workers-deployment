import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

// UpdateRestaurantImageType for PATCH
export type UpdateRestaurantImageType = {
  id: string;
  restaurantId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
  updatedAt?: string | null;
};

export const useUpdateRestaurantImage = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  return useMutation({
    mutationFn: async ({
      id,
      restaurantId,
      imageUrl,
      altText = null,
      displayOrder = null,
      isThumbnail = null,
      updatedAt = null,
    }: UpdateRestaurantImageType) => {
      const rpcClient = await getClient();

      const payload = {
        imageUrl,
        altText,
        displayOrder,
        isThumbnail,
        updatedAt,
      };

      const response = await rpcClient.api.restaurant[restaurantId].images[id].$patch({
        json: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update restaurant image");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success("Restaurant image updated successfully!", { id: toastId });
      queryClient.invalidateQueries({
        queryKey: ["restaurant-images", variables.restaurantId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update restaurant image", {
        id: toastId,
      });
    },
  });
};
