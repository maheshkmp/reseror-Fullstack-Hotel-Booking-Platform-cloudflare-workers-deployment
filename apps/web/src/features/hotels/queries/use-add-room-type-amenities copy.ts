import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { roomTypeAmenityInsertSchema } from "core/zod/roomType.schema";

const addRoomTypeAmenitiesSchema = z.array(roomTypeAmenityInsertSchema);

type AddRoomTypeAmenitiesInput = {
  roomTypeId: string;
  amenities: Array<{ amenityType: string }>;
};

export const useAddRoomTypeAmenities = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({
      roomTypeId,
      amenities,
    }: AddRoomTypeAmenitiesInput) => {
      const rpcClient = await getClient();

      const preparedAmenities = amenities.map((amenity) => ({
        roomTypeId,
        amenityType: amenity.amenityType,
      }));

      // Validate the prepared amenities
      addRoomTypeAmenitiesSchema.parse(preparedAmenities);

      const response = await rpcClient.api.rooms.types[":id"].amenities.$post({
        param: { id: roomTypeId },
        json: preparedAmenities,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to add room type amenities"
        );
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Adding room amenities...", { id: toastId });
    },
    onSuccess: (_, { roomTypeId }) => {
      toast.success("Room amenities added successfully!", { id: toastId });
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["room-type", roomTypeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["room-type-amenities", roomTypeId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add room amenities", {
        id: toastId,
      });
    },
  });

  return mutation;
};
