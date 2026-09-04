import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
  paymentType?: "cash" | "online" | null;
  hotelId?: string | null;
  status?: string | null;
  checkInDateFrom?: string | null;
  checkInDateTo?: string | null;
  isPaid?: string | null;
  minAmount?: string | null;
  maxAmount?: string | null;
}

export const useGetRoomBookings = (params: FilterParams) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "desc",
    paymentType,
    hotelId,
    status,
    checkInDateFrom,
    checkInDateTo,
    isPaid,
    minAmount,
    maxAmount,
  } = params;

  const query = useQuery({
    queryKey: [
      "roomBookings",
      {
        page,
        limit,
        search,
        sort,
        paymentType,
        hotelId,
        status,
        checkInDateFrom,
        checkInDateTo,
        isPaid,
        minAmount,
        maxAmount,
      },
    ],
    queryFn: async () => {
      const rpcClient = await getClient();

      const roomBookingsRes = await rpcClient.api["room-bookings"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          sort: sort || undefined,
          paymentType: paymentType || undefined,
          hotelId: hotelId || undefined,
          status: (status as any) || undefined,
          checkInDateFrom: checkInDateFrom || undefined,
          checkInDateTo: checkInDateTo || undefined,
          isPaid: isPaid || undefined,
          minAmount: minAmount || undefined,
          maxAmount: maxAmount || undefined,
        },
      });

      if (!roomBookingsRes.ok) {
        throw new Error("Failed to fetch roomBookings");
      }

      const roomBookings = await roomBookingsRes.json();
      return roomBookings;
    },
  });

  return query;
};

// Hook specifically for online payments only
export const useGetOnlineRoomBookings = (
  params: Omit<FilterParams, "paymentType"> = {}
) => {
  return useGetRoomBookings({
    ...params,
    paymentType: "online",
  });
};

// Hook for cash payments
export const useGetCashRoomBookings = (
  params: Omit<FilterParams, "paymentType">
) => {
  return useGetRoomBookings({
    ...params,
    paymentType: "cash",
  });
};

// Hook to get all room bookings (no restrictions by default)
export const useGetAllRoomBookings = (params: FilterParams) => {
  return useGetRoomBookings(params);
};

// Hook to get room bookings stats
export const useGetRoomBookingsStats = () => {
  return useQuery({
    queryKey: ["roomBookingsStats"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["room-bookings"].stats.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch roomBookings stats");
      }

      return res.json();
    },
  });
};
