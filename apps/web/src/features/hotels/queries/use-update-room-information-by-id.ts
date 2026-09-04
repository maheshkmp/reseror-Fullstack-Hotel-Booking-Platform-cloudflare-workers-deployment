import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

export type UpdateRoomPayload = {
  roomNumber: string;
  floorNumber: number | null;
  isAccessible: boolean | null;
  status: "available" | "occupied" | "maintenance" | "unavailable";
  lastCleanedAt: string | null; // ISO datetime string or null
};

export const useUpdateRoomInformationByID = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRoomPayload;
    }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.rooms[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update room information");
      }

      return response.json();
    },
  });
};
