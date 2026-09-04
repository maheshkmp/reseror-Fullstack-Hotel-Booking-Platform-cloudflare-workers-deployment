import { getClient } from "@/lib/rpc/client";

export interface RoomTypeAmenity {
  id: string;
  roomTypeId: string;
  amenityType: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface RoomTypeRoom {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floorNumber: number | null;
  isAccessible: boolean | null;
  status: string;
  lastCleanedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface RoomTypeImage {
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

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  description: string | null;
  price: string | null;
  baseOccupancy: number;
  maxOccupancy: number;
  extraBedCapacity: number | null;
  bedConfiguration: string;
  roomSizeSqm: string | null;
  viewType: string;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
  amenities: RoomTypeAmenity[];
  rooms: RoomTypeRoom[];
  images: RoomTypeImage[];
}

export async function getRoomTypeById(roomTypeId: string): Promise<RoomType> {
  const rpcClient = await getClient();
  const response = await rpcClient.api.rooms.types[":id"].$get({
    param: { id: roomTypeId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch room type");
  }

  return response.json();
}
