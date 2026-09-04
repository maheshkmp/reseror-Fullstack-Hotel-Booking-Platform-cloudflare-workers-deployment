"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getClient } from "@/lib/rpc/client";

import { RestaurantCard } from "@/features/resturant/components/restaurant-card";

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params?.id as string;

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurant-detail", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.restaurant[":id"].$get({
        param: { id: restaurantId },
      });
      if (!res.ok) throw new Error("Failed to fetch restaurant");
      const json = await res.json();
      return json as any;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto p-6 text-red-500">
        Failed to load restaurant details.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <RestaurantCard restaurant={restaurant} />
      </div>
    </div>
  );
}

