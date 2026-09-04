import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { unbanUser } from "../actions/unban-user";

type RequestType = {
  userId: string;
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RequestType) => {
      const { data, error } = await unbanUser(values);

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Unbanning user...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("User unbanned successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unban user", {
        id: toastId
      });
    }
  });

  return mutation;
};
