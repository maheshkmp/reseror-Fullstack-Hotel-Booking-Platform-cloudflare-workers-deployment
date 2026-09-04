import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelCommonAreas = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "common-areas", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      const areaRes = await rpcClient.api.hotels[":id"]["common-areas"].$get({
        param: { id: targetHotelId }
      });

      if (!areaRes.ok) {
        const errorData = await areaRes.json();
        throw new Error(errorData.message || "Failed to fetch property common areas");
      }

      const data = await areaRes.json();
      return data;
    },
    enabled: !!hotelId || hotelId === undefined
  });

  return query;
};
