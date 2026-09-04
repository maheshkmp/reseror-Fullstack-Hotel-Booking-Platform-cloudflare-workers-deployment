import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/lib/rpc/client";

export const useDeleteRoomBooking = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api["room-bookings"][":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to delete room booking");
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
