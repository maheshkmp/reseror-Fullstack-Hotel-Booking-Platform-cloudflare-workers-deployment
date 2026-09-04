import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelLanguages = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "languages", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      const languagesRes = await rpcClient.api.hotels[":id"]["languages"].$get({
        param: { id: targetHotelId }
      });

      if (!languagesRes.ok) {
        const errorData = await languagesRes.json();
        throw new Error(errorData.message || "Failed to fetch languages");
      }

      const data = await languagesRes.json();
      return data;
    },
    enabled: !!hotelId || hotelId === undefined
  });

  return query;
};
