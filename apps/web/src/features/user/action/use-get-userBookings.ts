import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
  paymentType?: "cash" | "online" | null;
}

export const useGetRoomBookings = (params: FilterParams) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "desc",
    paymentType,
  } = params;

  const query = useQuery({
    queryKey: ["roomBookings", { page, limit, search, sort, paymentType }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const roomBookingsRes = await rpcClient.api["room-bookings"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          sort: sort || undefined,
          paymentType: paymentType || undefined,
        },
      });

      if (!roomBookingsRes.ok) {
        const errorData = await roomBookingsRes.json();
        throw new Error("Failed to fetch roomBookings");
      }

      const roomBookings = await roomBookingsRes.json();
      return roomBookings;
    },
  });

  return query;
};

// Hook specifically for cash payments only
export const useGetCashRoomBookings = (
  params: Omit<FilterParams, "paymentType"> = {}
) => {
  return useGetRoomBookings({
    ...params,
    paymentType: "cash",
  });
};

// Hook for online payments
export const useGetOnlineRoomBookings = (
  params: Omit<FilterParams, "paymentType">
) => {
  return useGetRoomBookings({
    ...params,
    paymentType: "online",
  });
};

// Hook to get all payment types
export const useGetAllRoomBookings = (
  params: Omit<FilterParams, "paymentType">
) => {
  return useGetRoomBookings({
    ...params,
    paymentType: null, // No filter, gets all records
  });
};
