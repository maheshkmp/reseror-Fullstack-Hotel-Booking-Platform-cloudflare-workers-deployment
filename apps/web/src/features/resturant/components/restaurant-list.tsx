"use client";

import { useState } from "react";
import { RestaurantCard } from "./restaurant-card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Restaurant } from "core/zod";
import { useGetRestaurants } from "../actions/use-get-restaurant";
import { Input } from "@/components/ui/input";
import { SearchIcon, MapPinIcon, StarIcon, BuildingIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  userId?: string | null;
  hotelId?: string | null;
  restaurants?: Restaurant[];
  isLoading?: boolean;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "inactive":
      return "bg-gray-200 text-gray-600 border-gray-300";
    case "under_maintenance":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pending_approval":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export function RestaurantList({ hotelId, restaurants: initialData, isLoading: initialLoading }: Props) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading: fetchLoading } = useGetRestaurants({
    hotelId,
  }, {
    enabled: !initialData
  });

  const restaurants: Restaurant[] = initialData || data?.data || [];
  const isLoading = initialLoading || fetchLoading;
  
  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.city && r.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pt-4 pb-12">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by name or city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200 rounded-xl"
          />
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
          {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div 
            key={restaurant.id}
            onClick={() => setSelectedRestaurant(restaurant)}
            className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <BuildingIcon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className={`${getStatusColor(restaurant.status)} capitalize`}>
                  {restaurant.status.replace("_", " ")}
                </Badge>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
              
              <div className="space-y-2 mt-3">
                {restaurant.city && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                    <span className="truncate">{restaurant.city}{restaurant.country ? `, ${restaurant.country}` : ''}</span>
                  </div>
                )}
                {restaurant.starRating && (
                  <div className="flex items-center text-sm text-gray-600">
                    <StarIcon className="w-4 h-4 mr-2 text-amber-500 fill-amber-500 shrink-0" />
                    {restaurant.starRating} Stars
                  </div>
                )}
              </div>
            </div>
            
            {(restaurant.checkInTime || restaurant.checkOutTime) && (
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
                 {restaurant.checkInTime && <span>Opens: {restaurant.checkInTime}</span>}
                 {restaurant.checkOutTime && <span>Closes: {restaurant.checkOutTime}</span>}
              </div>
            )}
          </div>
        ))}

        {filteredRestaurants.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <BuildingIcon className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-900 font-medium text-lg">No restaurants found</p>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
              We couldn't find any restaurants matching your search criteria. Try a different term or clear the search.
            </p>
          </div>
        )}
      </div>

      <Dialog 
        open={!!selectedRestaurant} 
        onOpenChange={(open) => !open && setSelectedRestaurant(null)}
      >
        <DialogContent className="sm:max-w-[1000px] w-[95vw] p-0 overflow-hidden border border-gray-200 rounded-xl bg-white flex flex-col max-h-[90vh] shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Restaurant Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected restaurant.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 w-full h-full overflow-y-auto smooth-scroll">
            {selectedRestaurant && (
              <div className="p-0 bg-gray-50/30 min-h-full">
                <RestaurantCard restaurant={selectedRestaurant} />
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
