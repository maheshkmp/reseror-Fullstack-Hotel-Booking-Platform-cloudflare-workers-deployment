import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelTypes = () => {
  return useQuery({
    queryKey: ["hotel-types-all"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels.types.$get({
        query: {
          page: "1",
          limit: "50",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotel types");
      }

      const data = await response.json();
      return Array.isArray(data) ? data : (data as any).data || [];
    },
  });
};
