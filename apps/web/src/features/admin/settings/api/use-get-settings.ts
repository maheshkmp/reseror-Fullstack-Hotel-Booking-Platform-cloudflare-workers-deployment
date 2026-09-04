import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/rpc/client";

export function useGetSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const client = await getClient();
      const res = await client.api["site-settings"].$get();
      if (!res.ok) {
        throw new Error("Failed to fetch settings");
      }
      return res.json();
    },
  });
}
