import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

import { createOrganization } from "../actions/create-organization";
import { type CreateOrganizationSchema } from "core/zod/create-organization";

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreateOrganizationSchema) => {
      const { data, error } = await createOrganization(values);

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Setting up Hotel Organization...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("New organization created successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create organization", {
        id: toastId
      });
    }
  });

  return mutation;
};
