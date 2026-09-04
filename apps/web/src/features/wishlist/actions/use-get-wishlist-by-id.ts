import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetWishlistById = (id: string) => {
  return useQuery({
    queryKey: ["WishlistById", id],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.wishlist[id].$get({});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch wishlist by id");
      }
      return response.json();
    },
    enabled: !!id,
  });
};
