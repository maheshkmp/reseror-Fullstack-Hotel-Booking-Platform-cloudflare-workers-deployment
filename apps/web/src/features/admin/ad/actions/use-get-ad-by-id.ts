import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetAdById = (id: string) => {
  return useQuery({
    queryKey: ["ads", id],
    queryFn: async () => {
      const rpcClient = await getClient();

      const res = await rpcClient.api.ads[":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error((error as any).message || "Failed to fetch ad");
      }

      return res.json();
    },
    enabled: !!id,
  });
};
