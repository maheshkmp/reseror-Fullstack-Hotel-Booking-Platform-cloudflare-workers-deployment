import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelPolicies = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "policies", hotelId],
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

      const policiesRes = await rpcClient.api.hotels[":id"].policies.$get({
        param: { id: targetHotelId }
      });

      if (!policiesRes.ok) {
        const errorData = await policiesRes.json();
        throw new Error(errorData.message || "Failed to fetch hotel policies");
      }

      const data = await policiesRes.json();

      return data;
    },
    enabled: !!hotelId || hotelId === undefined // Enable if hotelId is provided or if we should fetch my-hotel
  });

  return query;
};
