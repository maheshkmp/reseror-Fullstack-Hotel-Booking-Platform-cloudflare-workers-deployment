import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetAllHotelImages = () => {
  const query = useQuery({
    queryKey: ["all-hotel-images"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels.images.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch all hotel images");
      }

      const data = await response.json();

      return data;
    },
  });

  return query;
};
