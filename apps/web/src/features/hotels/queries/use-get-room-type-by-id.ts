import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomTypeByID = (id: string | null) => {
  const query = useQuery({
    queryKey: ["room-types", { id }],
    queryFn: async () => {
      if (!id) return;

      const rpcClient = await getClient();

      const response = await rpcClient.api.rooms.types[":id"].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room type");
      }

      const data = await response.json();
      return data;
    },
    enabled: !!id
  });

  return query;
};
