"use client";

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bed, Building, ImageIcon, Plus, Loader } from "lucide-react";
import { useState } from "react";

import { BulkCreateRoomsForm } from "@/features/hotels/components/rooms/bulk-create-rooms-form";
import { RoomCard } from "@/features/hotels/components/rooms/room-card";
import { RoomTypeCard } from "@/features/hotels/components/rooms/room-type-card";
import { RoomTypeManagerModal } from "@/features/hotels/components/rooms/room-type-manager-modal";
import { ManageRoomTypeImages } from "@/features/hotels/components/rooms/update-room-type/manage-room-type-images";
import {
  useGetRoomTypes,
  useGetRooms,
  useDeleteRoomType,
} from "@/features/hotels/queries/rooms.query";
import { useUserHotel } from "@/features/hotels/queries/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ManageHotelRoomsPage() {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [bulkCreateRoomsDialogOpen, setBulkCreateRoomsDialogOpen] =
    useState(false);
  const [selectedTab, setSelectedTab] = useState("rooms");

  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomTypeToDelete, setRoomTypeToDelete] = useState<string | null>(null);

  const deleteRoomTypeMutation = useDeleteRoomType();

  const { data: userHotel, isLoading: isLoadingHotel } = useUserHotel();

  const hotelId = userHotel?.hotel.id;

  const { data: roomTypesData, isLoading: isLoadingRoomTypes } =
    useGetRoomTypes({ hotelId: hotelId });
  const { data: roomsData, isLoading: isLoadingRooms } = useGetRooms({
    hotelId: hotelId,
  });

  // Show loading state while getting hotel info
  if (isLoadingHotel) {
    return (
      <div className="container mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no hotel found
  if (!hotelId) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hotel found</h3>
            <p className="text-muted-foreground">
              You need to have a hotel setup before managing rooms.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Add this function to get the selected room type data
  const getSelectedRoomType = () => {
    if (!selectedRoomType || !roomTypesData?.data) return null;
    return roomTypesData.data.find((rt: any) => rt.id === selectedRoomType);
  };

  return (
    <div className="container mx-auto space-y-8">
      <RoomTypeManagerModal
        open={isManagerOpen}
        onOpenChange={(open) => setIsManagerOpen(open)}
        hotelId={hotelId}
        roomTypeId={selectedRoomType}
      />

      {/* Update Room Modal */}

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <div className="flex justify-between items-center">
          <TabsList className="grid w-[400px] grid-cols-2 rounded-xs">
            <TabsTrigger
              value="room-types"
              className="flex items-center gap-2 rounded-xs"
            >
              <Building className="h-4 w-4" />
              Room Types
            </TabsTrigger>
            <TabsTrigger
              value="rooms"
              className="flex items-center gap-2 rounded-xs"
            >
              <Bed className="h-4 w-4" />
              Individual Rooms
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" className="rounded-sm" onClick={() => {
              setSelectedRoomType(null);
              setIsManagerOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              New Room Type
            </Button>

            <Dialog
              open={bulkCreateRoomsDialogOpen}
              onOpenChange={setBulkCreateRoomsDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="rounded-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Bulk Create Rooms
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-fit">
                <ScrollArea className="h-full max-h-[90vh]">
                  <DialogHeader className="mb-3">
                    <DialogTitle>Bulk Create Roomss</DialogTitle>
                    <DialogDescription>
                      Create multiple rooms at once for efficiency.
                    </DialogDescription>
                  </DialogHeader>
                  <BulkCreateRoomsForm
                    hotelId={hotelId || ""}
                    onSuccess={() => setBulkCreateRoomsDialogOpen(false)}
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="room-types" className="space-y-6">
          <Card className="rounded-sm bg-secondary/45">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Room Types
              </CardTitle>
              <CardDescription>
                Manage your different room categories, each with its own
                specifications and pricing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRoomTypes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : roomTypesData?.data && roomTypesData.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roomTypesData.data.map((roomType: any) => (
                    <RoomTypeCard
                      key={roomType.id}
                      roomType={roomType}
                      onEdit={() => {
                        setSelectedRoomType(roomType.id);
                        setIsManagerOpen(true);
                      }}
                      onDelete={() => setRoomTypeToDelete(roomType.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No room types yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first room type to get started with room
                    management.
                  </p>
                  <Button onClick={() => {
                    setSelectedRoomType(null);
                    setIsManagerOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room Type
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add this new card for room type images when a room type is selected */}
          {/* {selectedRoomType && getSelectedRoomType() && (
            <Card className="rounded-sm bg-secondary/45">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Room Type Images
                </CardTitle>
                <CardDescription>
                  Manage images for {getSelectedRoomType()?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManageRoomTypeImages roomType={getSelectedRoomType()} />
              </CardContent>
            </Card>
          )} */}
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card className="rounded-sm bg-secondary/45">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Individual Rooms
              </CardTitle>
              <CardDescription>
                Manage individual room units, their status, and assignments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRooms ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-48 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : roomsData?.data && roomsData.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roomsData.data.map((room: any) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onViewBookings={() =>
                        console.log("View bookings", room.id)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No rooms created yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create room types first, then add individual rooms to your
                    hotel.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRoomType(null);
                        setIsManagerOpen(true);
                      }}
                    >
                      Create Room Type
                    </Button>
                    <Button
                      onClick={() => setBulkCreateRoomsDialogOpen(true)}
                      disabled={!roomTypesData?.data?.length}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Rooms
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!roomTypeToDelete} onOpenChange={(open) => !open && setRoomTypeToDelete(null)}>
        <AlertDialogContent className="rounded-xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Room Type</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to delete this room type? This action cannot be undone and will affect all assigned rooms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-slate-200 font-bold h-11">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold h-11 px-8"
              onClick={async () => {
                if (roomTypeToDelete) {
                  await deleteRoomTypeMutation.mutateAsync(roomTypeToDelete);
                  setRoomTypeToDelete(null);
                }
              }}
              disabled={deleteRoomTypeMutation.isPending}
            >
              {deleteRoomTypeMutation.isPending ? <Loader className="animate-spin size-4 mr-2" /> : null}
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
