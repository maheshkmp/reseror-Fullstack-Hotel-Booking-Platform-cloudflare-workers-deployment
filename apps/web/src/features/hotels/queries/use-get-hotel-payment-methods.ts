import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelPaymentMethods = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "payment-methods", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      const paymentRes = await rpcClient.api.hotels[":id"]["payment-methods"].$get({
        param: { id: targetHotelId }
      });

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json();
        throw new Error(errorData.message || "Failed to fetch accepted payment methods");
      }

      const data = await paymentRes.json();
      return data;
    },
    enabled: !!hotelId || hotelId === undefined
  });

  return query;
};
