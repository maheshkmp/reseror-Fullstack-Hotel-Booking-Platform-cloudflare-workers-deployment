import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

/**
 * Validates a promo code against active ads.
 * Returns the matching ad (with discountPercent) if valid.
 */
export const useValidatePromo = (promoCode?: string) => {
  return useQuery({
    queryKey: ["promo-validate", promoCode],
    queryFn: async () => {
      if (!promoCode) return null;

      const rpcClient = await getClient();
      const res = await rpcClient.api.ads.$get({
        query: {
          page: "1",
          limit: "50",
          search: promoCode,
          sort: "desc",
        },
      });

      if (!res.ok) return null;

      const data = await res.json();
      const ads = data?.data || data || [];
      const now = new Date();

      // Find an ad that matches the code, is active, and within the campaign window
      const match = ads.find((ad: any) => {
        const code = (ad.promoCode || "").toUpperCase().trim();
        const isActive =
          ad.isActive === true ||
          ad.isActive === "true" ||
          ad.isActive === 1;
        const startOk = !ad.startDate || new Date(ad.startDate) <= now;
        const endOk = !ad.endDate || new Date(ad.endDate) >= now;
        return code === promoCode.toUpperCase().trim() && isActive && startOk && endOk;
      });

      return match ?? null;
    },
    enabled: !!promoCode && promoCode.trim().length >= 3,
    staleTime: 60_000, // 1 min — avoid hammering on every keystroke
    retry: false,
  });
};
