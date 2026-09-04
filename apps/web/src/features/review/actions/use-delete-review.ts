import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

export const useDeleteReview = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.review[id].$delete({});

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete review");
      }

      return null;
    },
  });
};
