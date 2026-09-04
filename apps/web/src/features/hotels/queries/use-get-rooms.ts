import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomTypes = (hotelId?: string) => {
  return useQuery({
    queryKey: ["room-types", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.rooms.types.$get({
        query: hotelId ? { hotelId } : {}
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room types");
      }

      const data = await response.json();
      return data;
    },
    enabled: !!hotelId
  });
};

export const useGetRooms = (params?: {
  hotelId?: string;
  roomTypeId?: string;
  status?: string;
  page?: string;
  limit?: string;
}) => {
  return useQuery({
    queryKey: ["rooms", params],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.rooms.$get({
        query: {
          hotelId: params?.hotelId,
          roomTypeId: params?.roomTypeId,
          page: params?.page,
          limit: params?.limit,
          status: params?.status! as any
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();
      return data;
    }
  });
};
