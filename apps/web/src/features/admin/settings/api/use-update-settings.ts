import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/lib/rpc/client";
import { UpdateSiteSettings } from "core/zod";
import { toast } from "sonner";

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateSiteSettings) => {
      const client = await getClient();
      const res = await client.api["site-settings"].$patch({
        json: data,
      });
      if (!res.ok) {
        throw new Error("Failed to update settings");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update settings");
    },
  });
}
