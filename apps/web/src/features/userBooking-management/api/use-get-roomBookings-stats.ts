import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomBookingsStats = (query: { hotelId?: string } = {}, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["roomBookingsStats", query],
    enabled: options.enabled,
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["room-bookings"]["stats"].$get({
        query
      });
      
      const responseData = await response.json() as any;

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch room bookings stats");
      }

      return responseData as { 
        data: { 
          total: number;
          confirmed: number;
          pending: number;
          cancelled: number;
          totalRevenue: number;
          thisMonthBookings: number;
        } 
      };
    },
  });
};
