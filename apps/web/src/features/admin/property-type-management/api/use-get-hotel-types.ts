import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetHotelTypes = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["hotelTypes", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();
      const hotelTypesRes = await rpcClient.api["hotels"]["types"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });
      if (!hotelTypesRes.ok) {
        const errorData = await hotelTypesRes.json();
        throw new Error(errorData.message || "Failed to fetch hotelTypes");
      }
      return (await hotelTypesRes.json()) as any[]; // returns array
    },
  });

  return query;
};
