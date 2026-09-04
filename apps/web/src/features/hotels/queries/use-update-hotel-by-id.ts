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
  formattedAddress: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  hotelType: string | null;
  starRating: number | null;
  propertyClass: string | null;
  checkInTime: string | null;
  checkInEnd: string | null;
  checkOutStart: string | null;
  checkOutTime: string | null;
  minAge: number | null;
  childrenAllowed: boolean | null;
  extraBedsAvailable: boolean | null;
  extraBedsPolicy: string | null;
  status: "active" | "inactive" | "under_maintenance" | "pending_approval";
  commissionRate?: number | null;
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

      const response = await rpcClient.api.hotels[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update hotel");
      }

      return response.json();
    },
  });
};

export const useGetMyHotel = () => {
  return useQuery({
    queryKey: ["hotels", "my-hotel"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels["my-hotel"].$get();

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch my hotel");
      }

      return response.json();
    },
  });
};

export const useGetHotelByID = (id: string) => {
  return useQuery({
    queryKey: ["hotels", id],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch hotel");
      }

      return response.json();
    },
    enabled: !!id,
  });
};
