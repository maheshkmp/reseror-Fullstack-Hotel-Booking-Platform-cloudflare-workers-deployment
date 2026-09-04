"use client";

import { RestaurantCard } from "@/features/resturant/components/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getClient } from "@/lib/rpc/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Utensils } from "lucide-react";

export default function AdminRestaurantManagePage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params?.id as string;

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-restaurant-detail", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.restaurant[":id"].$get({
        param: { id: restaurantId },
      });
      if (!res.ok) throw new Error("Failed to fetch restaurant");
      return res.json() as any;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Utensils className="w-12 h-12 text-slate-300" />
        <p className="text-slate-500 font-medium">Restaurant not found.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/properties?type=restaurants")}
          className="gap-2 text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <RestaurantCard restaurant={restaurant} />
      </div>
    </div>
  );
}
