import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelTypes = () => {
  const query = useQuery({
    queryKey: ["hotel-types"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels.types.$get({
        query: {}
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property types");
      }

      const data = await response.json();

      return data;
    }
  });

  return query;
};
