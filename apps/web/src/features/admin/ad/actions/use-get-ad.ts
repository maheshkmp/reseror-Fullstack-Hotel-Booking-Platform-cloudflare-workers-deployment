import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface ReviewFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
  ownerType?: "admin" | "hotel" | "all";
}

export const useGetAds = (params: ReviewFilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc", ownerType } = params;

  return useQuery({
    queryKey: ["ads", { page, limit, search, sort, ownerType }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const adsRes = await rpcClient.api.ads.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
          ownerType: ownerType === "all" ? undefined : ownerType,
        },
      });

      if (!adsRes.ok) {
        const errorData = await adsRes.json();
        throw new Error(errorData.message || "Failed to fetch ads");
      }

      const ads = await adsRes.json();

      return ads;
    },
  });
};
