import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

interface StatsParams {
  hotelId?: string;
  organizationId?: string;
}

export const useGetRoomBookingsStats = (params: StatsParams = {}) => {
  const { hotelId, organizationId } = params;

  return useQuery({
    queryKey: ["roomBookingsStats", { hotelId, organizationId }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["room-bookings"].stats.$get({
        query: {
          hotelId: hotelId || undefined,
          organizationId: organizationId || undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room bookings statistics");
      }

      const res = await response.json();
      return res.data;
    },
    enabled: !!hotelId || !!organizationId,
  });
};
