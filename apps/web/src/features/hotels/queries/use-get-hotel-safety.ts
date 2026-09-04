import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelSafety = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "safety", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      const safetyRes = await rpcClient.api.hotels[":id"]["safety"].$get({
        param: { id: targetHotelId }
      });

      if (!safetyRes.ok) {
        const errorData = await safetyRes.json();
        throw new Error(errorData.message || "Failed to fetch health & safety features");
      }

      const data = await safetyRes.json();
      return data;
    },
    enabled: !!hotelId || hotelId === undefined
  });

  return query;
};
