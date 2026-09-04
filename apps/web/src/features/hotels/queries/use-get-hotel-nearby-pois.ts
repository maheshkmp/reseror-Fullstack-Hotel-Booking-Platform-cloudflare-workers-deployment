import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelNearbyPois = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "nearby-pois", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();

        if (!myHotelRes.ok) {
          throw new Error("Failed to fetch my hotel");
        }

        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      const poisRes = await rpcClient.api.hotels[":id"]["nearby-pois"].$get({
        param: { id: targetHotelId }
      });

      if (!poisRes.ok) {
        const errorData = await poisRes.json();
        throw new Error(errorData.message || "Failed to fetch nearby POIs");
      }

      const data = await poisRes.json();

      return data;
    },
    enabled: !!hotelId || hotelId === undefined
  });

  return query;
};
