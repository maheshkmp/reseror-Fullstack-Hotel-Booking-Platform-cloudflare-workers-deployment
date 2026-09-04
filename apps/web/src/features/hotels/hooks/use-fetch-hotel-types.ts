"use client";

import { useRPCClient } from "@/hooks/use-rpc-client";
import { useQuery } from "@tanstack/react-query";
import { transformDatesRecursive } from "../utils/transforms.client";

export function useFetchHotelTypes() {
  const rpcClient = useRPCClient();

  return useQuery({
    queryKey: ["hotelTypes"],
    queryFn: async () => {
      const response = await rpcClient.api.hotels.types.$get({
        query: {
          limit: "100" // Get all hotel types
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property types");
      }

      const data = await response.json();
      return transformDatesRecursive(data);
    }
  });
}
