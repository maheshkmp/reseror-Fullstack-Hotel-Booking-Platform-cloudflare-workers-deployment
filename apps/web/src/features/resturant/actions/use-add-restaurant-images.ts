import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Params for adding a restaurant image
export type AddRestaurantImageParams = {
  restaurantId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
};

export const useAddRestaurantImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      restaurantId,
      imageUrl,
      altText = null,
      displayOrder = null,
      isThumbnail = null,
    }: AddRestaurantImageParams) => {
      const rpcClient = await getClient();

      // Add image to restaurant
      const res = await rpcClient.api.restaurant[restaurantId].images.$post({
        json: {
          imageUrl,
          altText,
          displayOrder,
          isThumbnail,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add restaurant image");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate images for the specific restaurant
      queryClient.invalidateQueries({
        queryKey: ["restaurant-images", variables.restaurantId],
      });
    },
  });
};
