import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listStaff, createStaff, updateStaff, deleteStaff } from "../actions";
import { CreateStaff, UpdateStaff } from "../schemas";

export const useGetStaff = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["staff", { page, limit }],
    queryFn: () => listStaff(page, limit),
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStaff) => createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaff }) => updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};
