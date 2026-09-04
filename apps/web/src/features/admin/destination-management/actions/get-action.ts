import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface DestinationFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetDestinations = (params: DestinationFilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  return useQuery({
    queryKey: ["destinations", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const destinationsRes = await rpcClient.api.destination.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!destinationsRes.ok) {
        const errorData = await destinationsRes.json();
        throw new Error(errorData.message || "Failed to fetch destinations");
      }

      const destinations = await destinationsRes.json();

      return destinations;
    },
  });
};
