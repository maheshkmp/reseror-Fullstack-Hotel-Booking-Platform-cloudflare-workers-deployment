import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

import { banUser } from "../actions/ban-user";
import { BanUserSchema } from "core/zod";

type RequestType = BanUserSchema;

export const useBanUser = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RequestType) => {
      const { data, error } = await banUser(values);

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Banning user...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("User banned successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to ban user", {
        id: toastId
      });
    }
  });

  return mutation;
};
