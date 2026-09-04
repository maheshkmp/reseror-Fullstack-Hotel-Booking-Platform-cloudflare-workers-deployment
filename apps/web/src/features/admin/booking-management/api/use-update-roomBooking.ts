import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/lib/rpc/client";

export const useUpdateRoomBooking = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & any) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api["room-bookings"][":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        throw new Error("Failed to update room booking");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomBookings"] });
      queryClient.invalidateQueries({ queryKey: ["roomBookingsStats"] });
    },
  });

  return mutation;
};
