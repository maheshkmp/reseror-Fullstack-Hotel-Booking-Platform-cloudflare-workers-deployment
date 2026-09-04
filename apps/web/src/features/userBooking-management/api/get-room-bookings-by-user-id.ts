import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface UserRoomBookingFilterParams {
  page?: number;
  limit?: number;
  sort?: "desc" | "asc";
  hotelId?: string;
  roomTypeId?: string;
  status?: string;
  guestName?: string;
  checkInDateFrom?: string | null;
  checkInDateTo?: string | null;
  checkOutDateFrom?: string | null;
  checkOutDateTo?: string | null;
  paymentType?: "cash" | "online" | null;
  isPaid?: "true" | "false" | null;
  minAmount?: string | null;
  maxAmount?: string | null;
}

export const useGetRoomBookingsByUser = (
  userId: string | undefined,
  params: UserRoomBookingFilterParams = {}
) => {
  const {
    page = 1,
    limit = 10,
    sort = "desc",
    hotelId,
    roomTypeId,
    status,
    guestName,
    checkInDateFrom,
    checkInDateTo,
    checkOutDateFrom,
    checkOutDateTo,
    paymentType,
    isPaid,
    minAmount,
    maxAmount
  } = params;

  return useQuery({
    queryKey: [
      "roomBookingsByUser",
      userId,
      {
        page,
        limit,
        sort,
        hotelId,
        roomTypeId,
        status,
        guestName,
        checkInDateFrom,
        checkInDateTo,
        checkOutDateFrom,
        checkOutDateTo,
        paymentType,
        isPaid,
        minAmount,
        maxAmount
      },
    ],
    queryFn: async () => {
      if (!userId) throw new Error("userId is required");

      const rpcClient = await getClient();

      const response = await rpcClient.api["room-bookings"]["user"][
        ":userId"
      ].$get({
        param: { userId },
        query: {
          page: String(page),
          limit: String(limit),
          sort: sort || undefined,
          hotelId: hotelId || undefined,
          roomTypeId: roomTypeId || undefined,
          status: status || undefined,
          guestName: guestName || undefined,
          checkInDateFrom: checkInDateFrom || undefined,
          checkInDateTo: checkInDateTo || undefined,
          checkOutDateFrom: checkOutDateFrom || undefined,
          checkOutDateTo: checkOutDateTo || undefined,
          paymentType: paymentType || undefined,
          isPaid: isPaid || undefined,
          minAmount: minAmount || undefined,
          maxAmount: maxAmount || undefined,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch room bookings by user");
      }

      return response.json();
    },
    enabled: !!userId,
  });
};
