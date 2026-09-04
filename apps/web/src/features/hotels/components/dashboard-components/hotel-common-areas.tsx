"use client";

import { commonAreaFeatures } from "@/lib/helpers/common-areas-map";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useSaveRegistry } from "../../context/save-context";
import { useAddHotelCommonAreas } from "../../queries/use-add-hotel-common-areas";
import { useGetHotelCommonAreas } from "../../queries/use-get-hotel-common-areas";
import { Check, Sofa } from "lucide-react";

type Props = {
  className?: string;
  hotelId?: string;
};

export function ManageHotelCommonAreas({ className, hotelId }: Props) {
  const { data, isLoading, error } = useGetHotelCommonAreas(hotelId);
  const { mutateAsync, isPending } = useAddHotelCommonAreas(hotelId);
  const { register, unregister } = useSaveRegistry();

  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);

  useEffect(() => {
    if (data && !isLoading && !error) {
      setSelectedAreaIds(data.map((item: any) => item.areaType));
    }
  }, [data, isLoading, error]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    const initialIds = data.map((item: any) => item.areaType).sort();
    const currentIds = [...selectedAreaIds].sort();
    return JSON.stringify(initialIds) !== JSON.stringify(currentIds);
  }, [selectedAreaIds, data]);

  useEffect(() => {
    register({
      id: "hotel-common-areas",
      isDirty,
      onSave: async () => {
        const preparedAreas = selectedAreaIds.map((id) => ({ areaType: id }));
        await mutateAsync(preparedAreas);
      },
      onReset: () => {
        if (data) {
          setSelectedAreaIds(data.map((item: any) => item.areaType));
        }
      },
    });
    return () => unregister("hotel-common-areas");
  }, [register, unregister, isDirty, selectedAreaIds, data, mutateAsync]);

  const toggleArea = (id: string) => {
    setSelectedAreaIds((prev) =>
      prev.includes(id) ? prev.filter((areaId) => areaId !== id) : [...prev, id]
    );
  };

  const handleSaveChanges = () => {
    const preparedAreas = selectedAreaIds.map((id) => ({ areaType: id }));
    mutateAsync(preparedAreas);
  };

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-slate-100 text-slate-600">
            <Sofa className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Common Areas</CardTitle>
            <CardDescription className="text-xs">
              Select the shared spaces and facilities available to guests at your property.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        {isLoading && (
          <ScrollArea className="w-full h-[300px] bg-secondary/50 rounded-sm p-4">
            <div className="flex items-center flex-wrap gap-4">
              {Array(6).fill("").map((_, index) => (
                <Skeleton key={index} className="w-full sm:w-40 h-14 rounded-md" />
              ))}
            </div>
          </ScrollArea>
        )}

        {error && <p className="text-destructive font-semibold text-sm">{error.message}</p>}

        {!isLoading && !error && (
          <ScrollArea className="w-full max-h-[500px] rounded-md border border-dashed p-4 bg-secondary/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonAreaFeatures.map((area) => {
                const isSelected = selectedAreaIds.includes(area.id);
                const Icon = area.icon;
                return (
                  <button
                    key={area.id}
                    onClick={() => toggleArea(area.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border transition-all text-left relative",
                      isSelected 
                        ? "bg-slate-50 border-slate-900 ring-2 ring-slate-900/10" 
                        : "bg-background border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      isSelected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <span className={cn("text-xs font-black uppercase tracking-widest", isSelected ? "text-slate-950" : "text-slate-600")}>
                        {area.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-slate-900 rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
