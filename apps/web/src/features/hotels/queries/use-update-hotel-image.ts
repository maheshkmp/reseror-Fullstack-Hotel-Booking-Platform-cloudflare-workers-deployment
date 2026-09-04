import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { type HotelImageUpdateType } from "core/zod";

import { getClient } from "@/lib/rpc/client";

// UpdateHotelImageType without hotelId
export type UpdateHotelImageTypeWithoutHotelId = Omit<
  HotelImageUpdateType,
  "hotelId"
>;

export const useUpdateHotelImages = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (images: UpdateHotelImageTypeWithoutHotelId[]) => {
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

      // Promisified loop to handle async operations
      await Promise.all(
        preparedImages.map(async (image) => {
          const response = await rpcClient.api.hotels.images[":id"].$put({
            param: { id: image.id! },
            json: image
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to update hotel image"
            );
          }

          return response.json();
        })
      );

      return true;
    },
    onMutate: () => {
      toast.loading("Hotel images are Updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Hotel images updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create hotel", {
        id: toastId
      });
    }
  });

  return mutation;
};
