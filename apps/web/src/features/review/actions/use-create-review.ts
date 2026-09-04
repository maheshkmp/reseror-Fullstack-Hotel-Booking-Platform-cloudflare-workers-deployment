import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { reviewNratingInsertType } from "core/zod";

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async (data: reviewNratingInsertType) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.review.$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create review");
      }

      return response.json();
    },
  });
};
