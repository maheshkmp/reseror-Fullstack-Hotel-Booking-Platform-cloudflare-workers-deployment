import { getClient } from "@/lib/rpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InfluencerInsert } from "core/zod";

export const useInfluencers = () => {
  return useQuery({
    queryKey: ["influencers"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.affiliate.influencers.$get();
      if (!res.ok) throw new Error("Failed to fetch influencers");
      return res.json();
    },
  });
};

export const useCreateInfluencer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: InfluencerInsert) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.affiliate.influencers.$post({
        json: input,
      });
      if (!res.ok) throw new Error("Failed to create influencer");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
    },
  });
};

export const useAffiliateUsage = () => {
  return useQuery({
    queryKey: ["affiliate-usage"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.affiliate.usage.$get();
      if (!res.ok) throw new Error("Failed to fetch affiliate usage");
      return res.json();
    },
  });
};

export const usePayoutAffiliateUsage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.affiliate.usage[":id"].payout.$post({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to payout affiliate usage");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-usage"] });
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
    },
  });
};
