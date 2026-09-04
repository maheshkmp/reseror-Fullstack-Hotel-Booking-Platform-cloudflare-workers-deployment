import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUserRestaurantId = () => {
  return useQuery({
    queryKey: ["current-user-restaurant-id"],
    queryFn: async () => {
      const rpcClient = await getClient();

      // Get session to find userId
      const sessionRes = await rpcClient.api.auth.session.$get();
      if (!sessionRes.ok) throw new Error("Failed to get session");
      const session = await sessionRes.json();
      const userId = session.user?.id;
      if (!userId) throw new Error("No user found in session");

      // Get all restaurants
      const restaurantsRes = await rpcClient.api.restaurant.$get({
        query: {
          page: "1",
          limit: "100",
          sort: "desc",
        },
      });
      if (!restaurantsRes.ok) throw new Error("Failed to fetch restaurants");
      const restaurantsData = await restaurantsRes.json();
      const restaurants = restaurantsData.data;

      // Find restaurant where createdBy or created_by matches userId
      const myRestaurant = restaurants.find(
        (r: any) => r.createdBy === userId || r.created_by === userId
      );

      if (!myRestaurant) throw new Error("No restaurant found for user");

      return myRestaurant.id;
    },
  });
};
