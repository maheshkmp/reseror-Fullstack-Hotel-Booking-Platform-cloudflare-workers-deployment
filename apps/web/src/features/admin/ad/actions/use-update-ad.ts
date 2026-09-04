import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { adUpdateType } from "core/zod";

export const useUpdateAd = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: adUpdateType }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.ads[id].$patch({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update ad");
      }

      return response.json();
    },
  });
};
