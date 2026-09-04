import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

export const useDeleteArticle = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.article[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete article");
      }

      return null;
    },
  });
};
