import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelById = (id: string) => {
  return useQuery({
    queryKey: ["HotelById", id],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.hotels[id].$get({});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch hotel by id");
      }
      return response.json();
    },
    enabled: !!id,
  });
};
