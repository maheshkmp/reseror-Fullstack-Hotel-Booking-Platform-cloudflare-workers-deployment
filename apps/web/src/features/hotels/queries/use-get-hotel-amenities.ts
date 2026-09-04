import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelAmenities = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "amenities", hotelId],
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

      const amenitiesRes = await rpcClient.api.hotels[":id"].amenities.$get({
        param: { id: targetHotelId }
      });

      if (!amenitiesRes.ok) {
        const errorData = await amenitiesRes.json();
        throw new Error(errorData.message || "Failed to fetch hotel images");
      }

      const data = await amenitiesRes.json();

      return data;
    }
  });

  return query;
};
