import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { RestaurantUpdate } from "core/zod";

export const useUpdateRestaurant = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: RestaurantUpdate;
    }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.restaurant[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update restaurant");
      }

      return response.json();
    },
  });
};
