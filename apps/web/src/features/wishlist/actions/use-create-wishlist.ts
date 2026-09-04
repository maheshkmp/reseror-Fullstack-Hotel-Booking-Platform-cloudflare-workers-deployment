import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { WishlistInsertType } from "core/zod";

export const useCreateWishlist = () => {
  return useMutation({
    mutationFn: async (data: WishlistInsertType) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.wishlist.$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create wishlist");
      }

      return response.json();
    },
  });
};
