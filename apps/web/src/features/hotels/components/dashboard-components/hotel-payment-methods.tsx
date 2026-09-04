"use client";

import { paymentMethodsList } from "@/lib/helpers/payment-methods-map";
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
import { useAddHotelPaymentMethods } from "../../queries/use-add-hotel-payment-methods";
import { useGetHotelPaymentMethods } from "../../queries/use-get-hotel-payment-methods";
import { Check, CreditCard } from "lucide-react";

type Props = {
  className?: string;
  hotelId?: string;
};

export function ManageHotelPaymentMethods({ className, hotelId }: Props) {
  const { data, isLoading, error } = useGetHotelPaymentMethods(hotelId);
  const { mutateAsync, isPending } = useAddHotelPaymentMethods(hotelId);
  const { register, unregister } = useSaveRegistry();

  const [selectedMethodIds, setSelectedMethodIds] = useState<string[]>([]);

  useEffect(() => {
    if (data && !isLoading && !error) {
      setSelectedMethodIds(data.map((item: any) => item.cardType));
    }
  }, [data, isLoading, error]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    const initialIds = data.map((item: any) => item.cardType).sort();
    const currentIds = [...selectedMethodIds].sort();
    return JSON.stringify(initialIds) !== JSON.stringify(currentIds);
  }, [selectedMethodIds, data]);

  useEffect(() => {
    register({
      id: "hotel-payment-methods",
      isDirty,
      onSave: async () => {
        const preparedMethods = selectedMethodIds.map((id) => ({ cardType: id }));
        await mutateAsync(preparedMethods);
      },
      onReset: () => {
        if (data) {
          setSelectedMethodIds(data.map((item: any) => item.cardType));
        }
      },
    });
    return () => unregister("hotel-payment-methods");
  }, [register, unregister, isDirty, selectedMethodIds, data, mutateAsync]);

  const toggleMethod = (id: string) => {
    setSelectedMethodIds((prev) =>
      prev.includes(id) ? prev.filter((methodId) => methodId !== id) : [...prev, id]
    );
  };

  const handleSaveChanges = () => {
    const preparedMethods = selectedMethodIds.map((id) => ({ cardType: id }));
    mutateAsync(preparedMethods);
  };

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-slate-100 text-slate-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Cards Accepted at this Hotel</CardTitle>
            <CardDescription className="text-xs">
              Select the payment methods you accept from guests at your property.
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
              {paymentMethodsList.map((method) => {
                const isSelected = selectedMethodIds.includes(method.id);
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => toggleMethod(method.id)}
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
                        {method.label}
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
