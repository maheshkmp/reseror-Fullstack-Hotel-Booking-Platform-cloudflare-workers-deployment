import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

// Get images for a specific restaurant
export const useGetRestaurantImages = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ["restaurant-images", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const rpcClient = await getClient();
      
      const imagesRes = await rpcClient.api.restaurant[
        restaurantId as string
      ].images.$get({
        query: {
          page: "",
          limit: "",
          sort: "desc",
          search: "",
        },
      });
      if (!imagesRes.ok) throw new Error("Failed to fetch restaurant images");
      const imagesResult = await imagesRes.json();
      return { data: imagesResult.data, restaurantId };
    },
    select: (result) => ({
      restaurantImages: result.data,
      restaurantId: result.restaurantId,
    }),
  });
};
