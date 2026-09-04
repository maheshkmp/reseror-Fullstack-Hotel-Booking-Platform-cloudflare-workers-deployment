import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelFaqs = (hotelId?: string) => {
  const query = useQuery({
    queryKey: ["hotels", "faqs", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) throw new Error("Failed to fetch my hotel");
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      const faqRes = await rpcClient.api.hotels[":id"]["faqs"].$get({
        param: { id: targetHotelId }
      });

      if (!faqRes.ok) {
        const errorData = await faqRes.json();
        throw new Error(errorData.message || "Failed to fetch property FAQs");
      }

      const data = await faqRes.json();
      return data;
    },
    enabled: !!hotelId || hotelId === undefined
  });

  return query;
};
