import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

interface RoomTypeImage {
  id: string;
  hotelId: string;
  roomTypeId: string | null;
  imageUrl: string;
  altText: string | null;
  displayOrder: number | null;
  isThumbnail: boolean | null;
  createdAt: string;
  updatedAt: string | null;
}

interface RoomTypeImagesResponse {
  data: RoomTypeImage[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export const useGetRoomTypeImages = (roomTypeId: string | null) => {
  const query = useQuery<RoomTypeImagesResponse>({
    queryKey: ["room-type-images", roomTypeId],
    queryFn: async () => {
      if (!roomTypeId) {
        throw new Error("Room type ID is required");
      }

      const rpcClient = await getClient();

      const response = await rpcClient.api.rooms.types[":id"].images.$get({
        param: { id: roomTypeId },
        query: {
          page: "1",
          limit: "100",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room type images");
      }

      const data = await response.json();
      return data;
    },
    enabled: !!roomTypeId,
  });

  return query;
};
