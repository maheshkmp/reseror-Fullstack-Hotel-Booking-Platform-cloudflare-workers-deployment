import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelTransport = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "transport", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      const transportRes = await rpcClient.api.hotels[":id"]["transport"].$get({
        param: { id: targetHotelId }
      });

      if (!transportRes.ok) {
        const errorData = await transportRes.json();
        throw new Error(errorData.message || "Failed to fetch transport & parking specifics");
      }

      const data = await transportRes.json();
      return data;
    },
    enabled: !!hotelId || hotelId === undefined
  });

  return query;
};
