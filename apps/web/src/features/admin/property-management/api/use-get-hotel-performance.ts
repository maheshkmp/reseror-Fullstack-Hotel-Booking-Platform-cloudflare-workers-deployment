import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelPerformance = (id: string | undefined) => {
  return useQuery({
    queryKey: ["hotel-performance", id],
    queryFn: async () => {
      if (!id) throw new Error("Hotel ID is required");
      
      const rpcClient = await getClient();
      const res = await rpcClient.api.hotels[":id"].performance.$get({
        param: { id },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch performance data");
      }

      return await res.json();
    },
    enabled: !!id,
  });
};
