import { getClient } from "@/lib/rpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export type UpdateHotelPayload = {
  name: string;
  description: string | null;
  brandName: string | null;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  roomTyprInformationType: string | null;
  starRating: number | null;
  propertyClass: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "active" | "inactive" | "pending" | "archived";
};

export const useUpdateHotelByID = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateHotelPayload;
    }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.roomTyprInformations[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Failed to update room-typr-information"
        );
      }

      return response.json();
    },
  });
};

export const useGetMyHotel = () => {
  return useQuery({
    queryKey: ["room-typr-informations", "my-room-typr-information"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response =
        await rpcClient.api.roomTyprInformations[
          "my-room-typr-information"
        ].$get();

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Failed to fetch my room-typr-information"
        );
      }

      return response.json();
    },
  });
};
