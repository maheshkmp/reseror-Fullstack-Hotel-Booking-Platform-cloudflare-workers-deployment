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
    paymentType = "cash", // Default to "cash" payments only
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

      // Always filter to show only cash payments (exclude online)
      if (roomBookings.data) {
        const filteredData = roomBookings.data.filter(
          (booking: any) => booking.paymentType === "cash"
        );

        return {
          ...roomBookings,
          data: filteredData,
          meta: {
            ...roomBookings.meta,
            totalCount: filteredData.length.toString(),
            totalPages: Math.ceil(filteredData.length / limit),
          },
        };
      }

      return roomBookings;
    },
  });

  return query;
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

      return roomBookingsRes.json();
    },
  });
};
