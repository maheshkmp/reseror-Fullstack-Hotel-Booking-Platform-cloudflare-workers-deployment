import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { destinationInsertType } from "core/zod";

export const useCreateDestination = () => {
  return useMutation({
    mutationFn: async (data: destinationInsertType) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.destination.$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create destination");
      }

      return response.json();
    },
  });
};
