import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Room {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floorNumber: number | null;
  isAccessible: boolean | null;
  status: "available" | "occupied" | "maintenance";
  lastCleanedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  roomType: {
    id: string;
    hotelId: string;
    name: string;
    description: string | null;
    price: number | null;
    baseOccupancy: number;
    maxOccupancy: number;
    extraBedCapacity: number | null;
    bedConfiguration: string;
    roomSizeSqm: number | null;
    viewType: "ocean" | "city" | "garden" | "mountain";
    status: boolean;
    createdAt: string;
    updatedAt: string | null;
  };
}

export const useGetRoomById = (roomId: string) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: async (): Promise<Room> => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["rooms"][":id"].$get({
        param: {
          id: roomId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room");
      }

      return response.json();
    },
    enabled: !!roomId, // Only run query if roomId is provided
  });
};
