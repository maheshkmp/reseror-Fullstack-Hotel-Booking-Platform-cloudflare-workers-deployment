"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import type {
  BulkRoomCreation,
  CreateRoomInput,
  CreateRoomTypeInput,
  GetRoomsParams,
  UpdateRoomInput,
  UpdateRoomTypeInput
} from "core/zod";

// Room Queries
export const useGetRooms = (params?: GetRoomsParams) => {
  return useQuery({
    queryKey: ["rooms", params],
    queryFn: async () => {
      const client = await getClient();
      const response = await client.api.rooms.$get({
        query: params as any
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      return response.json();
    }
  });
};

export const useGetRoomById = (id: string) => {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: async () => {
      const client = await getClient();
      const response = await client.api.rooms[":id"].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room");
      }

      return response.json();
    },
    enabled: !!id
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateRoomInput) => {
      const client = await getClient();
      const response = await client.api.rooms.$post({
        json: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create room");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Room created successfully!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create room");
    }
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRoomInput }) => {
      const client = await getClient();
      const response = await client.api.rooms[":id"].$patch({
        param: { id },
        json: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update room");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Room updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update room");
    }
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const client = await getClient();
      const response = await client.api.rooms[":id"].$delete({
        param: { id }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete room");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Room deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete room");
    }
  });
};

// Room Type Queries
export const useGetRoomTypes = (params?: { hotelId?: string }) => {
  return useQuery({
    queryKey: ["room-types", params],
    queryFn: async () => {
      const client = await getClient();
      const response = await client.api.rooms.types.$get({
        query: params || {}
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room types");
      }

      return response.json();
    }
  });
};

export const useCreateRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomTypeInput) => {
      const client = await getClient();

      const response = await client.api.rooms.types.$post({
        json: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create room type");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Room type created successfully!");
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create room type");
    }
  });
};

export const useUpdateRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: UpdateRoomTypeInput;
    }) => {
      const client = await getClient();

      const response = await client.api.rooms.types[":id"].$patch({
        param: { id },
        json: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update room type");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Room type updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update room type");
    }
  });
};

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const client = await getClient();
      const response = await client.api.rooms.types[":id"].$delete({
        param: { id }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete room type");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Room type deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete room type");
    }
  });
};

export const useBulkCreateRooms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkRoomCreation) => {
      const client = await getClient();
      const response = await client.api.rooms.bulk.$post({
        json: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create rooms");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(
        `${(data as any).count || "Multiple"} rooms created successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create rooms");
    }
  });
};

// Room Type Images Queries
export const useAddRoomTypeImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomTypeId,
      imageData
    }: {
      roomTypeId: string;
      imageData: {
        imageUrl: string;
        altText?: string;
        displayOrder?: number;
        isThumbnail?: boolean;
      };
    }) => {
      const client = await getClient();
      const response = await client.api.rooms.types[":id"].images.$post({
        param: { id: roomTypeId },
        json: imageData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add room type image");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Room type image added successfully!");
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add room type image");
    }
  });
};

export const useDeleteRoomTypeImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomTypeId,
      imageId
    }: {
      roomTypeId: string;
      imageId: string;
    }) => {
      const client = await getClient();
      const response = await client.api.rooms.types[":id"].images[
        ":imageId"
      ].$delete({
        param: { id: roomTypeId, imageId }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete room type image");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Room type image deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete room type image");
    }
  });
};
