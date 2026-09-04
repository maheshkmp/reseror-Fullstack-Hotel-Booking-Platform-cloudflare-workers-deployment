"use client";

import { sustainabilityInitiatives } from "@/lib/helpers/sustainability-map";
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
import { useAddHotelSustainability } from "../../queries/use-add-hotel-sustainability";
import { useGetHotelSustainability } from "../../queries/use-get-hotel-sustainability";
import { InsertHotelSustainabilityType, HotelSustainability } from "core/zod";
import { Check, Leaf } from "lucide-react";

type Props = {
  className?: string;
  hotelId?: string;
};

export function ManageHotelSustainability({ className, hotelId }: Props) {
  const { data, isLoading, error } = useGetHotelSustainability(hotelId);
  const { mutateAsync, isPending } = useAddHotelSustainability(hotelId);
  const { register, unregister } = useSaveRegistry();

  const [selectedInitiativeIds, setSelectedInitiativeIds] = useState<string[]>([]);

  useEffect(() => {
    if (data && !isLoading && !error) {
      setSelectedInitiativeIds(data.map((item: HotelSustainability) => item.initiativeType));
    }
  }, [data, isLoading, error]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    const initialIds = data.map((item: HotelSustainability) => item.initiativeType).sort();
    const currentIds = [...selectedInitiativeIds].sort();
    return JSON.stringify(initialIds) !== JSON.stringify(currentIds);
  }, [selectedInitiativeIds, data]);

  useEffect(() => {
    register({
      id: "hotel-sustainability",
      isDirty,
      onSave: async () => {
        const preparedSustainability: InsertHotelSustainabilityType[] = selectedInitiativeIds.map(
          (id) => ({
            hotelId: hotelId || "",
            initiativeType: id,
          })
        );
        await mutateAsync(preparedSustainability);
      },
      onReset: () => {
        if (data) {
          setSelectedInitiativeIds(data.map((item: HotelSustainability) => item.initiativeType));
        }
      },
    });
    return () => unregister("hotel-sustainability");
  }, [register, unregister, isDirty, selectedInitiativeIds, data, mutateAsync]);

  const toggleInitiative = (id: string) => {
    setSelectedInitiativeIds((prev) =>
      prev.includes(id) ? prev.filter((initiativeId) => initiativeId !== id) : [...prev, id]
    );
  };

  const handleSaveChanges = () => {
    const preparedSustainability: InsertHotelSustainabilityType[] = selectedInitiativeIds.map(
      (id) => ({
        hotelId: hotelId || "",
        initiativeType: id,
      })
    );

    mutateAsync(preparedSustainability);
  };

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-50 text-green-600">
                <Leaf className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl leading-tight">Sustainability & Green Initiatives</CardTitle>
              <CardDescription className="text-xs">
                Showcase your property&apos;s commitment to environmental practices.
              </CardDescription>
            </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 mt-4">
        {isLoading && (
          <ScrollArea className="w-full h-[300px] bg-secondary/50 rounded-sm p-4">
            <div className="flex items-center flex-wrap gap-4">
              {Array(6)
                .fill("")
                .map((_, index) => (
                  <Skeleton key={index} className="w-full sm:w-40 h-14 rounded-md" />
                ))}
            </div>
          </ScrollArea>
        )}

        {error && <p className="text-destructive font-semibold text-sm">{error.message}</p>}

        {!isLoading && !error && (
          <ScrollArea className="w-full max-h-[500px] rounded-md border border-dashed p-4 bg-secondary/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sustainabilityInitiatives.map((initiative) => {
                  const isSelected = selectedInitiativeIds.includes(initiative.id);
                  const Icon = initiative.icon;
                  return (
                    <button
                      key={initiative.id}
                      onClick={() => toggleInitiative(initiative.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border transition-all text-left relative",
                        isSelected 
                          ? "bg-green-50/10 border-green-500 ring-2 ring-green-500/20" 
                          : "bg-background border-slate-200 hover:border-green-400 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isSelected ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className={cn("text-xs font-black uppercase tracking-widest", isSelected ? "text-green-700" : "text-slate-600")}>
                          {initiative.label}
                        </span>
                      </div>
                      {isSelected && (
                          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-0.5">
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
