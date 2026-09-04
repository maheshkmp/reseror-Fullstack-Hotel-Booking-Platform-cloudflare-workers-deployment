import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetRestaurantBookings = (restaurantId: string) => {
  return useQuery({
    queryKey: ["restaurant-bookings", restaurantId],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["restaurant-booking"].$get({
        query: { restaurantId },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: !!restaurantId,
  });
};
