import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { type InsertHotelImageType } from "core/zod";

import { getClient } from "@/lib/rpc/client";

// InsertHotelImageType without hotelId
export type InsertHotelImageTypeWithoutHotelId = Omit<
  InsertHotelImageType,
  "hotelId"
>;

export const useAddHotelImages = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (images: InsertHotelImageTypeWithoutHotelId[]) => {
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

      const preparedImages = images.map((image) => ({
        ...image,
        hotelId: targetHotelId as string
      }));

      const response = await rpcClient.api.hotels.images.$post({
        json: preparedImages
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add new hotel images");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Hotel images are Uploading...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Hotel images uploaded successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create hotel", {
        id: toastId
      });
    }
  });

  return mutation;
};
