"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useSaveRegistry } from "../../context/save-context";
import { useGetMyHotel, useUpdateHotelByID, useGetHotelByID } from "../../queries/use-update-hotel-by-id";
import { ScrollText, Baby, UserCheck, BedDouble } from "lucide-react";
import { toast } from "sonner";

type Props = {
  className?: string;
  hotelId?: string;
};

export function ManageHotelHouseRules({ className, hotelId }: Props) {
  const myHotel = useGetMyHotel();
  const hotelById = useGetHotelByID(hotelId || "");
  
  const { data: hotel, isLoading } = hotelId ? hotelById : myHotel;
  const { mutateAsync: updateHotel, isPending } = useUpdateHotelByID();
  const { register, unregister } = useSaveRegistry();

  const [rules, setRules] = useState({
    minAge: 0,
    childrenAllowed: true,
    extraBedsAvailable: false,
    extraBedsPolicy: "",
  });

  useEffect(() => {
    if (hotel) {
      setRules({
        minAge: hotel.minAge || 0,
        childrenAllowed: hotel.childrenAllowed ?? true,
        extraBedsAvailable: hotel.extraBedsAvailable ?? false,
        extraBedsPolicy: hotel.extraBedsPolicy || "",
      });
    }
  }, [hotel]);

  const isDirty = useMemo(() => {
    if (!hotel) return false;
    return (
      rules.minAge !== (hotel.minAge || 0) ||
      rules.childrenAllowed !== (hotel.childrenAllowed ?? true) ||
      rules.extraBedsAvailable !== (hotel.extraBedsAvailable ?? false) ||
      rules.extraBedsPolicy !== (hotel.extraBedsPolicy || "")
    );
  }, [rules, hotel]);

  useEffect(() => {
    register({
      id: "hotel-house-rules",
      isDirty,
      onSave: async () => {
        if (!hotel?.id) return;
        await updateHotel({
          id: hotel.id,
          data: {
            ...hotel,
            ...rules,
          },
        });
      },
      onReset: () => {
        if (hotel) {
          setRules({
            minAge: hotel.minAge || 0,
            childrenAllowed: hotel.childrenAllowed ?? true,
            extraBedsAvailable: hotel.extraBedsAvailable ?? false,
            extraBedsPolicy: hotel.extraBedsPolicy || "",
          });
        }
      },
    });
    return () => unregister("hotel-house-rules");
  }, [register, unregister, isDirty, rules, hotel, updateHotel]);

  const handleSave = () => {
    if (!hotel?.id) return;
    
    updateHotel({
      id: hotel.id,
      data: {
        ...hotel,
        ...rules,
      },
    });
  };

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Loading rules...</div>;

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-slate-100 text-slate-600">
            <ScrollText className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">House Rules</CardTitle>
            <CardDescription className="text-xs">
              Set age restrictions and policies for children and extra beds.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-md border border-dashed bg-secondary/5">
          {/* Min Age Restriction */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-500" />
              <Label htmlFor="minAge" className="font-bold text-xs uppercase tracking-wider">Minimum Age for Check-in</Label>
            </div>
            <Input
              id="minAge"
              type="number"
              value={rules.minAge}
              onChange={(e) => setRules({ ...rules, minAge: parseInt(e.target.value) || 0 })}
              className="bg-background shadow-none"
              placeholder="0 for no limit"
            />
            <p className="text-[10px] text-muted-foreground">Set to 0 if there are no age restrictions.</p>
          </div>

          {/* Children Allowed */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-background">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-slate-500" />
                <Label className="font-bold text-xs uppercase tracking-wider">Children Allowed</Label>
              </div>
              <p className="text-[10px] text-muted-foreground">Is the property child-friendly?</p>
            </div>
            <Switch
              checked={rules.childrenAllowed}
              onCheckedChange={(checked) => setRules({ ...rules, childrenAllowed: checked })}
            />
          </div>

          {/* Extra Beds Available */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-background">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-slate-500" />
                <Label className="font-bold text-xs uppercase tracking-wider">Extra Beds / Cots</Label>
              </div>
              <p className="text-[10px] text-muted-foreground">Do you provide extra bedding options?</p>
            </div>
            <Switch
              checked={rules.extraBedsAvailable}
              onCheckedChange={(checked) => setRules({ ...rules, extraBedsAvailable: checked })}
            />
          </div>

          {/* Extra Beds Policy */}
          {rules.extraBedsAvailable && (
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="extraBedsPolicy" className="font-bold text-xs uppercase tracking-wider">Extra Beds Policy Details</Label>
              <Textarea
                id="extraBedsPolicy"
                value={rules.extraBedsPolicy}
                onChange={(e) => setRules({ ...rules, extraBedsPolicy: e.target.value })}
                placeholder="e.g. Extra beds available for children under 12 at $20/night..."
                className="min-h-[100px] bg-background shadow-none"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
