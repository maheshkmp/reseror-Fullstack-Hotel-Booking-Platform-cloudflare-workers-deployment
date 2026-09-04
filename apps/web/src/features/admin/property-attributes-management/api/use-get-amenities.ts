import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";
import type { Amenity } from "core/zod";

export const useGetGlobalAmenities = () => {
  return useQuery({
    queryKey: ["globalAmenities"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await (rpcClient.api as any)["amenities"].$get({ query: {} });
      if (!res.ok) throw new Error("Failed to fetch amenities");
      return (await res.json()) as Amenity[];
    },
  });
};
