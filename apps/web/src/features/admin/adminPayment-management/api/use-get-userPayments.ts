import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface UserPaymentFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
  hotelId?: string | null;
  type?: string | null;
  paid?: boolean | null;
  dueDateFrom?: string | null;
  dueDateTo?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface UserPayment {
  id: string;
  hotelId: string;
  bookingId: string;
  organizationId: string;
  type: string;
  amount: string;
  dueDate: string | null;
  paid: boolean | null;
  paidAt: string | null;
  createdAt: string | null;
}

export interface UserPaymentsResponse {
  data: UserPayment[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export const useGetUserPayments = (params: UserPaymentFilterParams = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "desc",
    hotelId = "",
    type = "",
    paid = null,
    dueDateFrom = "",
    dueDateTo = "",
    dateFrom = "",
    dateTo = "",
  } = params;

  const query = useQuery({
    queryKey: [
      "userPayments",
      {
        page,
        limit,
        search,
        sort,
        hotelId,
        type,
        paid,
        dueDateFrom,
        dueDateTo,
        dateFrom,
        dateTo,
      },
    ],
    queryFn: async (): Promise<UserPaymentsResponse> => {
      const rpcClient = await getClient();

      const userPaymentsRes = await rpcClient.api["payments-hotel"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          sort: sort || undefined,
          search: search || undefined,
          hotelId: hotelId || undefined,
          type: type || undefined,
          paid: paid !== null ? paid.toString() : undefined,
          dueDateFrom: dueDateFrom || undefined,
          dueDateTo: dueDateTo || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        },
      });

      if (!userPaymentsRes.ok) {
        const errorData = await userPaymentsRes.json();
        throw new Error(errorData.message || "Failed to fetch user payments");
      }

      const userPayments = await userPaymentsRes.json();
      return userPayments as UserPaymentsResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
};

// Hook specifically for commission payments
export const useGetCommissionPayments = (
  params: Omit<UserPaymentFilterParams, "type"> = {}
) => {
  return useGetUserPayments({
    ...params,
    type: "receive_commission_from_cash",
  });
};

// Hook specifically for paid payments
export const useGetPaidUserPayments = (
  params: Omit<UserPaymentFilterParams, "paid"> = {}
) => {
  return useGetUserPayments({
    ...params,
    paid: true,
  });
};

// Hook specifically for unpaid payments
export const useGetUnpaidUserPayments = (
  params: Omit<UserPaymentFilterParams, "paid"> = {}
) => {
  return useGetUserPayments({
    ...params,
    paid: false,
  });
};

// Hook for payments by hotel
export const useGetUserPaymentsByHotel = (
  hotelId: string,
  params: Omit<UserPaymentFilterParams, "hotelId"> = {}
) => {
  return useGetUserPayments({
    ...params,
    hotelId,
  });
};

// Hook for payments within date range
export const useGetUserPaymentsByDateRange = (
  dateFrom: string,
  dateTo: string,
  params: Omit<UserPaymentFilterParams, "dateFrom" | "dateTo"> = {}
) => {
  return useGetUserPayments({
    ...params,
    dateFrom,
    dateTo,
  });
};

// Hook for payments with due date range
export const useGetUserPaymentsByDueDate = (
  dueDateFrom: string,
  dueDateTo: string,
  params: Omit<UserPaymentFilterParams, "dueDateFrom" | "dueDateTo"> = {}
) => {
  return useGetUserPayments({
    ...params,
    dueDateFrom,
    dueDateTo,
  });
};
