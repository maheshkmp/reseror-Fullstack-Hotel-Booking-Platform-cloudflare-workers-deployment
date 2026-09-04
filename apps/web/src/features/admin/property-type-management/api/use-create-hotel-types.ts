import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateHotelTypeInput {
  name: string;
  thumbnail?: string | null;
}

export const useCreateHotelType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateHotelTypeInput) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["hotels"]["types"].$post({
        json: {
          name: input.name,
          thumbnail: input.thumbnail ?? null,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create property type");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelTypes"] });
    },
  });
};
