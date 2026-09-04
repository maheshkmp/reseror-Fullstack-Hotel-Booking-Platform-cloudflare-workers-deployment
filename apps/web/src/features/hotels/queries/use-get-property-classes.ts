import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetPropertyClasses = () => {
  const query = useQuery({
    queryKey: ["property-classes"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["property-classes"].$get({
        query: {}
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property classes");
      }

      const data = await response.json();

      return data;
    }
  });

  return query;
};
