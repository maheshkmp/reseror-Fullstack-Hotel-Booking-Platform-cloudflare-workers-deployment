import { authClient } from "@/lib/auth-client";
import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetMyHotel = (options: { enabled?: boolean } = {}) => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  
  const isHotelUser = session?.user?.role === "hotelOwner" || session?.user?.role === "admin";
  const isEnabled = options.enabled !== undefined ? options.enabled : (!!session && !isSessionPending && isHotelUser);

  return useQuery({
    queryKey: ["my-hotel", session?.user?.id],
    enabled: isEnabled,
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.hotels["my-hotel"].$get({
        query: {},
      });
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch my hotel");
      }
      return await response.json();
    },
  });
};
