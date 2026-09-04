import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelImages = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "images", hotelId],
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

      const response = await rpcClient.api.hotels[":id"].images.$get({
        param: { id: targetHotelId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotel images");
      }

      const data = await response.json();

      return data;
    },
    enabled: true,
  });

  return query;
};
