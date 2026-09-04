"use client";

import { useGetMyHotel } from "@/features/hotels/api/use-get-my-hotel";
import { useGetMyRestaurants } from "@/features/resturant/actions/use-get-my-restaurants";
import { CreateRestaurantForm } from "@/features/resturant/components/new-restaurant-form";
import { ManageRestaurantImages } from "@/features/resturant/components/restaurant-images";
import { RestaurantList } from "@/features/resturant/components/restaurant-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ManageRestaurantsPage() {
  const [createRestaurantDialogOpen, setCreateRestaurantDialogOpen] =
    useState(false);
  const { data: myRestaurants, isLoading: loadingMyRestaurants } =
    useGetMyRestaurants();

  return (
    <div className="container mx-auto space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-md font-bold">Manage Restaurants</h1>
          <p className="text-xs text-muted-foreground">
            Add and manage restaurants for your hotel.
          </p>
        </div>
        <Dialog
          open={createRestaurantDialogOpen}
          onOpenChange={setCreateRestaurantDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-sm">
              <Plus className="h-3 w-3 mr-2" />
              New Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent style={{ width: "70vw", maxWidth: "70vw" }} className="p-0 overflow-hidden border-0 rounded-2xl shadow-2xl h-[95vh] flex flex-col">
            <DialogTitle className="sr-only">Create New Restaurant</DialogTitle>
            <DialogDescription className="sr-only">
              Fill out the form below to add a new restaurant to your hotel.
            </DialogDescription>
            <div className="flex-1 w-full overflow-hidden flex flex-col">
              <CreateRestaurantForm
                onSuccess={() => setCreateRestaurantDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      
          <RestaurantList restaurants={myRestaurants} isLoading={loadingMyRestaurants} />

    </div>
  );
}
