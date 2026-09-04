import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { articleInsertType } from "core/zod";

export const useCreateArticle = () => {
  return useMutation({
    mutationFn: async (data: articleInsertType) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.article.$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create article");
      }

      return response.json();
    },
  });
};
