import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";
import type { destination } from "core/zod";

export const useGetDestinationById = (id: string) => {
  return useQuery({
    queryKey: ["destination", id],
    queryFn: async (): Promise<destination> => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.destination[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch destination");
      }

      return response.json();
    },
    enabled: !!id,
  });
};
