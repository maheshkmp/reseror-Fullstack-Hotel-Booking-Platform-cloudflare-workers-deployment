import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
  hotelType?: string | null;
  propertyClass?: string | null;
  status?: string | null;
  isOverdue?: string | null;
}

export const useGetHotels = (params: FilterParams) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "desc",
    hotelType = null,
    propertyClass = null,
    status = null,
    isOverdue = null,
  } = params;

  const query = useQuery({
    queryKey: [
      "hotels",
      { page, limit, search, sort, hotelType, propertyClass, status, isOverdue },
    ],
    queryFn: async () => {
      const rpcClient = await getClient();

      const hotelsRes = await rpcClient.api.hotels.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
          hotelType: hotelType || undefined,
          propertyClass: propertyClass || undefined,
          status: status || undefined,
          isOverdue: isOverdue || undefined,
        },
      });

      if (!hotelsRes.ok) {
        const errorData = await hotelsRes.json();
        throw new Error(errorData.message || "Failed to fetch hotels");
      }

      const hotels = await hotelsRes.json();

      return hotels;
    },
  });

  return query;
};
