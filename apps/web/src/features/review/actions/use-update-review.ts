import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { reviewNratingUpdateType } from "core/zod";

export const useUpdateReview = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: reviewNratingUpdateType;
    }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.review[id].$patch({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update review");
      }

      return response.json();
    },
  });
};
