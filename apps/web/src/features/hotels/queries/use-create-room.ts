import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import {
  type BulkRoomCreation,
  type RoomInsert
} from "core/zod";

import { getClient } from "@/lib/rpc/client";

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RoomInsert) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.rooms.$post({
        json: values
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create room");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Creating Room...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Room created successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create room", {
        id: toastId
      });
    }
  });

  return mutation;
};

export const useBulkCreateRooms = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: BulkRoomCreation) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.rooms.bulk.$post({
        json: values
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create rooms");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Creating Rooms...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success(`'Multiple'} rooms created successfully!`, { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create rooms", {
        id: toastId
      });
    }
  });

  return mutation;
};
