import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotels = (query: {
  page?: string;
  limit?: string;
  search?: string;
  city?: string;
  state?: string;
  status?: string;
  propertyTypeId?: string;
  propertyClassId?: string;
  sort?: "asc" | "desc";
} = {}) => {
  return useQuery({
    queryKey: ["hotels", query],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels.$get({
        query,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }

      return response.json();
    },
  });
};
