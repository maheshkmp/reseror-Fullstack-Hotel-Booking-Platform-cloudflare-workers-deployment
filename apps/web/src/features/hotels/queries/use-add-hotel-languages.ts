import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { InsertHotelLanguageType } from "core/zod";
import { getClient } from "@/lib/rpc/client";

export const useAddHotelLanguages = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (languages: InsertHotelLanguageType[]) => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) {
          throw new Error("Failed to fetch my hotel");
        }
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      if (!targetHotelId) throw new Error("Hotel not found");

      const preparedLanguages = languages.map((lang) => ({
        ...lang,
        hotelId: targetHotelId as string,
      }));

      const response = await rpcClient.api.hotels[":id"]["languages"].$post({
        param: { id: targetHotelId as string },
        json: preparedLanguages,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update staff languages");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Staff languages are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Staff languages updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "languages"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update staff languages", {
        id: toastId
      });
    }
  });

  return mutation;
};
