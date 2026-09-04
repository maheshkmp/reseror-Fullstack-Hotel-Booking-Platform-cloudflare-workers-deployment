import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  hotelId?: string | null;
  roomTypeId?: string | null;
  status?: string | null;
  guestName?: string | null;
  checkInDateFrom?: string | null;
  checkInDateTo?: string | null;
  checkOutDateFrom?: string | null;
  checkOutDateTo?: string | null;
  paymentType?: "cash" | "online" | null;
  isPaid?: "true" | "false" | null;
  minAmount?: string | null;
  maxAmount?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetRoomBookings = (params: FilterParams = {}, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["roomBookings", params],
    enabled: options.enabled,
    queryFn: async () => {
      const rpcClient = await getClient();

      const roomBookingsRes = await rpcClient.api["room-bookings"].$get({
        query: {
          page: (params.page || 1).toString(),
          limit: (params.limit || 10).toString(),
          sort: params.sort || undefined,
          hotelId: params.hotelId || undefined,
          roomTypeId: params.roomTypeId || undefined,
          status: params.status || undefined,
          guestName: params.guestName || undefined,
          checkInDateFrom: params.checkInDateFrom || undefined,
          checkInDateTo: params.checkInDateTo || undefined,
          checkOutDateFrom: params.checkOutDateFrom || undefined,
          checkOutDateTo: params.checkOutDateTo || undefined,
          paymentType: params.paymentType || undefined,
          isPaid: params.isPaid || undefined,
          minAmount: params.minAmount || undefined,
          maxAmount: params.maxAmount || undefined,
        },
      });

      if (!roomBookingsRes.ok) {
        throw new Error("Failed to fetch roomBookings");
      }

      const roomBookingsData = (await roomBookingsRes.json()) as any;
      const roomBookings = roomBookingsData;

      // Always filter to show only cash payments (exclude online)
      // Note: In a production app, the backend should handle this, 
      // but keeping it here to preserve original behavior.
      if (roomBookings.data && !params.paymentType) {
        const filteredData = roomBookings.data.filter(
          (booking: any) => booking.paymentType === "cash"
        );

        return {
          ...roomBookings,
          data: filteredData,
          meta: {
            ...roomBookings.meta,
            totalCount: filteredData.length.toString(),
            totalPages: Math.ceil(filteredData.length / (params.limit || 10)),
          },
        };
      }

      return roomBookings;
    },
  });
};

// Hook specifically for cash payments only (this is now the default behavior)
export const useGetCashRoomBookings = (
  params: Omit<FilterParams, "paymentType"> = {}
) => {
  return useGetRoomBookings({
    ...params,
    paymentType: "cash",
  });
};

// Hook for online payments (if needed for admin purposes only)
export const useGetOnlineRoomBookings = (
  params: Omit<FilterParams, "paymentType">
) => {
  return useGetRoomBookings({
    ...params,
    paymentType: "online",
  });
};

// Hook to get all payment types (if needed for admin override)
export const useGetAllRoomBookings = (
  params: Omit<FilterParams, "paymentType">
) => {
  return useQuery({
    queryKey: ["allRoomBookings", params],
    queryFn: async () => {
      const rpcClient = await getClient();

      const roomBookingsRes = await rpcClient.api["room-bookings"].$get({
        query: {
          page: (params.page || 1).toString(),
          limit: (params.limit || 10).toString(),
          sort: params.sort || undefined,
          // No paymentType filter - gets all
        },
      });

      if (!roomBookingsRes.ok) {
        throw new Error("Failed to fetch roomBookings");
      }

      return (await roomBookingsRes.json()) as any;
    },
  });
};
