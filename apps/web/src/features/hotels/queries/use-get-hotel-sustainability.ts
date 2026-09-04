import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelSustainability = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "sustainability", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      const sustainabilityRes = await rpcClient.api.hotels[":id"]["sustainability"].$get({
        param: { id: targetHotelId }
      });

      if (!sustainabilityRes.ok) {
        const errorData = await sustainabilityRes.json();
        throw new Error(errorData.message || "Failed to fetch sustainability initiatives");
      }

      const data = await sustainabilityRes.json();
      return data;
    },
    enabled: !!hotelId || hotelId === undefined
  });

  return query;
};
