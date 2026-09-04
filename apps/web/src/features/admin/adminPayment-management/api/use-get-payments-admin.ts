import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface AdminPaymentQueryParams {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
  hotelId?: string;
  type?: "incoming" | "outgoing";
  method?: string;
  settled?: "true" | "false";
  dateFrom?: string;
  dateTo?: string;
}

export const useGetPaymentsAdmin = (query: AdminPaymentQueryParams = {}) => {
  return useQuery({
    queryKey: ["payments-admin", query],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["payments-admin"].$get({
        query,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin payments");
      }

      return response.json();
    },
  });
};
