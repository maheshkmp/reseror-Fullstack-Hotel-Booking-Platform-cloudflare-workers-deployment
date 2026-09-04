"use client";

import { safetyFeaturesList, SafetyFeatureItem } from "@/lib/helpers/safety-features-map";
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
import { useAddHotelSafety } from "../../queries/use-add-hotel-safety";
import { useGetHotelSafety } from "../../queries/use-get-hotel-safety";
import { InsertHotelSafetyType, HotelSafetyFeature } from "core/zod";
import { Check, ShieldCheck, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  className?: string;
  hotelId?: string;
};

export function ManageHotelSafety({ className, hotelId }: Props) {
  const { data, isLoading, error } = useGetHotelSafety(hotelId);
  const { mutateAsync, isPending } = useAddHotelSafety(hotelId);
  const { register, unregister } = useSaveRegistry();

  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);

  useEffect(() => {
    if (data && !isLoading && !error) {
      setSelectedFeatureIds(data.map((feature: HotelSafetyFeature) => feature.featureType));
    }
  }, [data, isLoading, error]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    const initialIds = data.map((item: any) => item.featureType).sort();
    const currentIds = [...selectedFeatureIds].sort();
    return JSON.stringify(initialIds) !== JSON.stringify(currentIds);
  }, [selectedFeatureIds, data]);

  useEffect(() => {
    register({
      id: "hotel-safety",
      isDirty,
      onSave: async () => {
        const preparedSafety: InsertHotelSafetyType[] = selectedFeatureIds.map(
          (id) => ({
            hotelId: hotelId || "",
            featureType: id,
          })
        );
        await mutateAsync(preparedSafety);
      },
      onReset: () => {
        if (data) {
          setSelectedFeatureIds(data.map((feature: HotelSafetyFeature) => feature.featureType));
        }
      },
    });
    return () => unregister("hotel-safety");
  }, [register, unregister, isDirty, selectedFeatureIds, data, mutateAsync]);

  const toggleFeature = (id: string) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(id) ? prev.filter((featureId) => featureId !== id) : [...prev, id]
    );
  };

  const handleSaveChanges = () => {
    const preparedSafety: InsertHotelSafetyType[] = selectedFeatureIds.map(
      (id) => ({
        hotelId: hotelId || "",
        featureType: id,
      })
    );

    mutateAsync(preparedSafety);
  };

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Health & Safety</CardTitle>
              <CardDescription className="text-xs">
                Highlight the safety measures and features available at your property.
              </CardDescription>
            </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 mt-4">
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
              <TooltipProvider>
                {safetyFeaturesList.map((feature) => {
                  const isSelected = selectedFeatureIds.includes(feature.id);
                  const Icon = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl border transition-all text-left relative",
                        isSelected 
                          ? "bg-emerald-50/10 border-emerald-500 ring-2 ring-emerald-500/20" 
                          : "bg-background border-slate-200 hover:border-emerald-400 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 pr-6">
                        <span className={cn("text-xs font-black uppercase tracking-widest", isSelected ? "text-emerald-700" : "text-slate-600")}>
                          {feature.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium leading-relaxed">
                          {feature.description}
                        </span>
                      </div>
                      {isSelected && (
                          <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-0.5">
                              <Check className="w-3 h-3 text-white" />
                          </div>
                      )}
                    </button>
                  );
                })}
              </TooltipProvider>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
