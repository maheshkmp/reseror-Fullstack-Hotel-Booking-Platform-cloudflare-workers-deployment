import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface ReviewByHotelIdParams {
  hotelId: string;
  page?: number;
  limit?: number;
}

export const useGetReviewsByHotelId = (params: ReviewByHotelIdParams) => {
  const { hotelId, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["reviews-by-hotel", { hotelId, page, limit }],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.review.hotel[hotelId].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch hotel reviews");
      }
      return await res.json();
    },
  });
};
