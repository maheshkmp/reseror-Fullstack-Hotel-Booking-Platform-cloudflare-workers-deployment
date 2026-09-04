import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Define schema matching exact API request format
const roomTypeImageInputSchema = z.object({
  roomTypeId: z.null(),
  imageUrl: z.string(),
  altText: z.null(),
  displayOrder: z.null(),
  isThumbnail: z.null(),
});

type RoomTypeImageInput = {
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
};

export const useAddRoomTypeImages = (roomTypeId: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (images: RoomTypeImageInput[]) => {
      const rpcClient = await getClient();

      // Format each image to match API requirements exactly
      const preparedImages = images.map(() => ({
        roomTypeId: null,
        imageUrl: images[0].imageUrl,
        altText: null,
        displayOrder: null,
        isThumbnail: null,
      }));

      try {
        // Validate with schema before sending
        preparedImages.forEach((image) => {
          roomTypeImageInputSchema.parse(image);
        });

        const response = await rpcClient.api.rooms.types[":id"].images.$post({
          param: { id: roomTypeId },
          json: preparedImages[0], // Send single image as per API format
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add room type image");
        }

        return await response.json();
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error("Invalid image data format");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Uploading room image...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Room image uploaded successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["room-type", roomTypeId] });
      queryClient.invalidateQueries({
        queryKey: ["room-type-images", roomTypeId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload room image", {
        id: toastId,
      });
    },
  });

  return mutation;
};
