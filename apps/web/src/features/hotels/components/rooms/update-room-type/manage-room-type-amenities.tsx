"use client";

import { useAddRoomTypeAmenities } from "@/features/hotels/queries/use-add-room-type-amenities";
import { RoomTypeWithRelations } from "@/features/hotels/schemas/rooms.schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useGetGlobalAmenities } from "@/features/admin/property-attributes-management/api/use-get-amenities";

type Props = {
  roomType: RoomTypeWithRelations;
};

export function ManageRoomTypeAmenities({ roomType }: Props) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const { data: hotelAmenities, isPending: loadingAmenities } =
    useGetGlobalAmenities();
  const { mutate: addAmenities, isPending: addingAmenities } =
    useAddRoomTypeAmenities();

  // Get existing room type amenity types
  const existingAmenityTypes =
    roomType.amenities?.map((a) => a.amenityType) || [];

  const handleAddAmenities = () => {
    if (selectedAmenities.length === 0) return;

    addAmenities({
      roomTypeId: roomType.id,
      amenities: selectedAmenities.map((amenityType) => ({ amenityType })),
    });

    setSelectedAmenities([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Room Type Amenities</h2>
        <p className="text-sm text-muted-foreground">
          Select amenities from your hotel to add to this room type.
        </p>
      </div>

      {loadingAmenities ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {hotelAmenities?.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.name);
              const isExisting = existingAmenityTypes.includes(amenity.name);

              return (
                <Button
                  key={amenity.id}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    if (!isExisting) {
                      setSelectedAmenities((prev) =>
                        prev.includes(amenity.name)
                          ? prev.filter((a) => a !== amenity.name)
                          : [...prev, amenity.name]
                      );
                    }
                  }}
                  disabled={isExisting}
                >
                  {isExisting ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : isSelected ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  <span className="capitalize">{amenity.name}</span>
                </Button>
              );
            })}
          </div>

          {selectedAmenities.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedAmenities.length} amenities selected
              </p>
              <Button onClick={handleAddAmenities} disabled={addingAmenities}>
                {addingAmenities ? "Adding..." : "Add Selected Amenities"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Existing Amenities Section */}
      {roomType.amenities && roomType.amenities.length > 0 && (
        <div className="pt-6 border-t">
          <h3 className="text-md font-medium mb-3">Current Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {roomType.amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="p-3 bg-secondary rounded-md flex items-center gap-2"
              >
                <Check className="h-4 w-4 text-green-500" />
                <span className="capitalize">
                  {amenity.amenityType.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
