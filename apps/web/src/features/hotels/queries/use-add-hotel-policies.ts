import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { InsertHotelPolicyType } from "core/zod";

import { getClient } from "@/lib/rpc/client";

export const useAddHotelPolicies = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (policies: InsertHotelPolicyType[]) => {
      const rpcClient = await getClient();

      let targetHotelId = hotelId;

      if (!targetHotelId) {
        const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();
        if (!myHotelRes.ok) {
          throw new Error("Failed to fetch my hotel");
        }
        const myHotel = await myHotelRes.json();
        targetHotelId = myHotel.id;
      }

      if (!targetHotelId) throw new Error("Hotel not found");

      const preparedPolicies = policies.map((policy) => ({
        hotelId: targetHotelId as string,
        policyType: policy.policyType,
        policyText: policy.policyText,
        effectiveDate: policy.effectiveDate,
        isActive: policy.isActive ?? true
      }));

      const response = await rpcClient.api.hotels[":id"].policies.$post({
        param: { id: targetHotelId as string },
        json: preparedPolicies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hotel policies");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Hotel policies are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Hotel policies updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "policies"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update hotel policies", {
        id: toastId
      });
    }
  });

  return mutation;
};
