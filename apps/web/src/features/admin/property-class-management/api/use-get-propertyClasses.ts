import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetPropertyClass = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["propertyClass", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const propertyClassRes = await rpcClient.api["property-classes"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!propertyClassRes.ok) {
        const errorData = await propertyClassRes.json();
        throw new Error("Failed to fetch propertyClass");
      }

      const propertyClass = await propertyClassRes.json();

      return propertyClass;
    },
  });

  return query;
};
