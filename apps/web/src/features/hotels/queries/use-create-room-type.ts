import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { type RoomTypeInsert } from "core/zod";

import { getClient } from "@/lib/rpc/client";

export const useCreateRoomType = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RoomTypeInsert) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.rooms.types.$post({
        json: values
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create room type");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Creating Room Type...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Room type created successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create room type", {
        id: toastId
      });
    }
  });

  return mutation;
};
