import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface RoomFilterParams {
  page?: number;
  limit?: number;
  sort?: "desc" | "asc";
  search?: string;
  hotelId?: string;
  roomTypeId?: string;
  status?: "available" | "occupied" | "maintenance";
  floorNumber?: number;
}

export const useGetRooms = (params: RoomFilterParams) => {
  const {
    page = 1,
    limit = 10,
    sort = "desc",
    search = "",
    hotelId,
    roomTypeId,
    status,
    floorNumber,
  } = params;

  return useQuery({
    queryKey: [
      "rooms",
      { page, limit, sort, search, hotelId, roomTypeId, status, floorNumber },
    ],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["rooms"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          sort,
          search,
          hotelId: hotelId || undefined,
          roomTypeId: roomTypeId || undefined,
          status: status || undefined,
          floorNumber: floorNumber?.toString() || undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      return response.json();
    },
  });
};
