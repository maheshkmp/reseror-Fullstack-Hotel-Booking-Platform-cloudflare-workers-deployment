import { useQuery } from "@tanstack/react-query";

import { listUsers } from "../actions/get-users";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  tab?: string;
  status?: string;
}

export const useGetUsers = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", tab = "all", status = "" } = params;

  const query = useQuery({
    queryKey: ["users", { page, limit, search, tab, status }],
    queryFn: async () => {
      return await listUsers(params);
    }
  });

  return query;
};
