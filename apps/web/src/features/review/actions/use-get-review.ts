import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface ReviewFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetReviews = (params: ReviewFilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  return useQuery({
    queryKey: ["reviews", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const reviewsRes = await rpcClient.api.review.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!reviewsRes.ok) {
        const errorData = await reviewsRes.json();
        throw new Error(errorData.message || "Failed to fetch reviews");
      }

      const reviews = await reviewsRes.json();

      return reviews;
    },
  });
};
