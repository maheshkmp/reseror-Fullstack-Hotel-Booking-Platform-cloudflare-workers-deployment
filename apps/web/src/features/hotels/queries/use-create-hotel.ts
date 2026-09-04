import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { type HotelInsertType } from "core/zod";

import { getClient } from "@/lib/rpc/client";

export const useCreateHotel = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: HotelInsertType) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.hotels.$post({
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
      toast.loading("Your Hotel is Getting Ready...", { id: toastId });
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
