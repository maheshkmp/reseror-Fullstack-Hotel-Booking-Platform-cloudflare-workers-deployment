import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { adInsertType } from "core/zod";

export const useCreateAd = () => {
  return useMutation({
    mutationFn: async (data: adInsertType) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.ads.$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create ad");
      }

      return response.json();
    },
  });
};
