import { authClient } from "@/lib/auth-client";
import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data: session } = await authClient.getSession();
      return session;
    }
  });
};

export const useUserHotel = () => {
  return useQuery({
    queryKey: ["user-hotel"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get({});

      if (!myHotelRes.ok) {
        const errorData = await myHotelRes.json();
        throw new Error(errorData.message || "Failed to fetch hotel");
      }

      const hotelData = await myHotelRes.json();

      return {
        hotel: hotelData
      };
    }
  });
};
