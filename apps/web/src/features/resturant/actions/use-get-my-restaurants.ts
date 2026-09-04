import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetMyRestaurants = () => {
  return useQuery({
    queryKey: ["myRestaurants"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.restaurant["myrestaurants"].$get();
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch restaurants");
      }
      return res.json() as Promise<any[]>;
    },
  });
};
