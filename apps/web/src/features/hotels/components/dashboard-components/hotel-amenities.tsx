"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useSaveRegistry } from "../../context/save-context";
import { useAddHotelAmenities } from "../../queries/use-add-hotel-amenities";
import { useGetHotelAmenities } from "../../queries/use-get-hotel-amenities";
import { InsertHotelAmenityType, HotelAmenity } from "core/zod";
import { AmenitiesPool } from "../amenities-pool";
import { useGetGlobalAmenities } from "@/features/admin/property-attributes-management/api/use-get-amenities";

type Props = {
  className?: string;
  hotelId?: string;
};

export function ManageHotelAmenities({ className, hotelId }: Props) {
  // Current hotel's saved amenities
  const { data, isLoading, error } = useGetHotelAmenities(hotelId);
  const { mutateAsync, isPending } = useAddHotelAmenities(hotelId);

  // Global amenities pool from admin
  const { data: globalPool, isLoading: poolLoading } = useGetGlobalAmenities();

  const { register, unregister } = useSaveRegistry();

  // State is a list of amenity *names* (strings)
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  // Initialise selection from existing hotel data
  useEffect(() => {
    if (data && !isLoading && !error) {
      setSelectedNames(data.map((a: HotelAmenity) => a.amenityType));
    }
  }, [data, isLoading, error]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    const initialNames = data.map((a: HotelAmenity) => a.amenityType).sort();
    const currentNames = [...selectedNames].sort();
    return JSON.stringify(initialNames) !== JSON.stringify(currentNames);
  }, [selectedNames, data]);

  useEffect(() => {
    register({
      id: "hotel-amenities",
      isDirty,
      onSave: async () => {
        const preparedAmenities: InsertHotelAmenityType[] = selectedNames.map(
          (name) => ({ hotelId: hotelId || "", amenityType: name })
        );
        await mutateAsync(preparedAmenities);
      },
      onReset: () => {
        if (data) {
          setSelectedNames(data.map((a: HotelAmenity) => a.amenityType));
        }
      },
    });
    return () => unregister("hotel-amenities");
  }, [register, unregister, isDirty, selectedNames, data, mutateAsync]);

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl">Manage Hotel Amenities</CardTitle>
        <CardDescription className="text-xs">
          Select amenities available at your property. The list is managed by your admin.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        {(isLoading || poolLoading) && (
          <ScrollArea className="w-full h-[300px] bg-secondary/50 rounded-sm p-4">
            <div className="flex items-center flex-wrap gap-3">
              {Array(30)
                .fill("")
                .map((_, index) => (
                  <Skeleton key={index} className="w-28 h-10 rounded-md" />
                ))}
            </div>
          </ScrollArea>
        )}

        {error && <p className="text-destructive">{error.message}</p>}

        {!isLoading && !poolLoading && (
          <AmenitiesPool
            pool={globalPool ?? []}
            selectedNames={selectedNames}
            onSelect={setSelectedNames}
          />
        )}
      </CardContent>
    </Card>
  );
}
