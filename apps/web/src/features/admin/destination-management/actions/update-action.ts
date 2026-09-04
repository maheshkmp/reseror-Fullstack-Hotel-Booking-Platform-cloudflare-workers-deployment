import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { destinationUpdateType } from "core/zod";

export const useUpdateDestination = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: destinationUpdateType;
    }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.destination[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update destination");
      }

      return response.json();
    },
  });
};
