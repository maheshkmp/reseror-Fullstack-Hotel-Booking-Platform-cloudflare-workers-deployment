import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomBookingsStatsByUserId = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["roomBookingsStatsByUser", userId],
    queryFn: async () => {
      if (!userId) throw new Error("userId is required");

      const rpcClient = await getClient();

      const response = await rpcClient.api["room-bookings"]["user"][":userId"]["stats"].$get({
        param: { userId }
      });
      
      const responseData = await response.json() as any;

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch user room bookings stats");
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
    enabled: !!userId,
  });
};
