import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { getClient } from "@/lib/rpc/client";

export type FaqInput = {
  question: string;
  answer: string;
  displayOrder?: number;
};

export const useAddHotelFaqs = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (faqs: FaqInput[]) => {
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

      const response = await rpcClient.api.hotels[":id"]["faqs"].$post({
        param: { id: targetHotelId },
        json: faqs,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update FAQs");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("FAQs are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("FAQs updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "faqs"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update FAQs", {
        id: toastId
      });
    }
  });

  return mutation;
};
