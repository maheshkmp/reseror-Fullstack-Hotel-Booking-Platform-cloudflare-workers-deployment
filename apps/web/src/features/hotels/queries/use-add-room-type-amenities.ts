import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { roomTypeAmenityInsertSchema } from "core/zod";

type AddRoomTypeAmenityInput = {
  roomTypeId: string;
  amenities: Array<{ amenityType: string }>;
};

export const useAddRoomTypeAmenities = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ roomTypeId, amenities }: AddRoomTypeAmenityInput) => {
      const rpcClient = await getClient();

      // Send each amenity as a separate POST request
      const results = [];
      for (const amenity of amenities) {
        const payload = {
          roomTypeId,
          amenityType: amenity.amenityType,
        };

        roomTypeAmenityInsertSchema.parse(payload);

        const response = await rpcClient.api.rooms.types[":id"].amenities.$post(
          {
            param: { id: roomTypeId },
            json: payload,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to add room type amenity"
          );
        }

        results.push(await response.json());
      }
      return results;
    },
    onMutate: () => {
      toast.loading("Adding room type amenities...", { id: toastId });
    },
    onSuccess: (_, { roomTypeId }) => {
      toast.success("Room type amenities added successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["room-type", roomTypeId] });
      queryClient.invalidateQueries({
        queryKey: ["room-type-amenities", roomTypeId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add room type amenities", {
        id: toastId,
      });
    },
  });

  return mutation;
};
