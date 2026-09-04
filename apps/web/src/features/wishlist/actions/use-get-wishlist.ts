import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface WishlistFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetWishlist = (params: WishlistFilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  return useQuery({
    queryKey: ["Wishlist", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const wishlistRes = await rpcClient.api.wishlist.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!wishlistRes.ok) {
        const errorData = await wishlistRes.json();
        throw new Error(errorData.message || "Failed to fetch wishlist");
      }

      const wishlist = await wishlistRes.json();

      return wishlist;
    },
  });
};
