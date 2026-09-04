"use client";

import { useRPCClient } from "@/hooks/use-rpc-client";
import { useQuery } from "@tanstack/react-query";
import { transformDatesRecursive } from "../utils/transforms.client";

export function useFetchPropertyClasses() {
  const rpcClient = useRPCClient();

  return useQuery({
    queryKey: ["propertyClasses"],
    queryFn: async () => {
      const response = await rpcClient.api["property-classes"].$get({
        query: {
          limit: "100" // Get all property classes
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property classes");
      }

      const data = await response.json();
      return transformDatesRecursive(data);
    }
  });
}
