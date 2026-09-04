import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CreateAmenityInput {
  name: string;
  icon?: string | null;
}

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAmenityInput) => {
      const rpcClient = await getClient();
      const res = await (rpcClient.api as any)["amenities"].$post({
        json: { name: input.name, icon: input.icon ?? null },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create amenity");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["globalAmenities"] });
      toast.success("Amenity created successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
};
