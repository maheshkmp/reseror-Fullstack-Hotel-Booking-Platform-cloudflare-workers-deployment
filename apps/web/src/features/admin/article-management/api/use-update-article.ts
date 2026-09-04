import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { articleUpdateType } from "core/zod";

export const useUpdateArticle = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: articleUpdateType;
    }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.article[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update article");
      }

      return response.json();
    },
  });
};
