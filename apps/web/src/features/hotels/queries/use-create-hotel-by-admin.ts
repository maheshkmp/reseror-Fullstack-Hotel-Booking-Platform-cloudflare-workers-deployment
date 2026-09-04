import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { HotelInsertByAdminType } from "core/zod";

import { getClient } from "@/lib/rpc/client";

export const useCreateHotelByAdmin = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: HotelInsertByAdminType) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels.admin.$post({
        json: values
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create hotel");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("New Hotel is Getting Ready...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Hotel created successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create hotel", {
        id: toastId
      });
    }
  });

  return mutation;
};
