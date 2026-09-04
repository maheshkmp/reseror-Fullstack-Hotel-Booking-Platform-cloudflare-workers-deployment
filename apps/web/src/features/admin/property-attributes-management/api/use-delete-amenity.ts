import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();
      const res = await (rpcClient.api as any)["amenities"][":id"].$delete({
        param: { id },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete amenity");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["globalAmenities"] });
      toast.success("Amenity deleted.");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
};
