"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/tanstack-form";
import { CheckCircle2, Plus, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useBulkCreateRooms, useGetRoomTypes } from "../../queries/rooms.query";
import {
  bulkRoomCreationSchema,
  type BulkRoomCreation
} from "core/zod";
type Props = {
  className?: string;
  hotelId: string;
  onSuccess?: () => void;
};

const defaultValues: Partial<BulkRoomCreation> = {
  roomNumbers: [],
  floorNumber: 1,
  isAccessible: false
};

export function BulkCreateRoomsForm({ className, hotelId, onSuccess }: Props) {
  const { mutate, isPending } = useBulkCreateRooms();
  const { data: roomTypesData } = useGetRoomTypes({ hotelId });

  const [roomNumberInput, setRoomNumberInput] = useState("");

  const form = useAppForm({
    validators: { onChange: bulkRoomCreationSchema },
    defaultValues: { ...defaultValues, hotelId },
    onSubmit: ({ value }) =>
      mutate(value as BulkRoomCreation, {
        onSuccess: () => {
          form.reset();
          setRoomNumberInput("");
          onSuccess?.();
        }
      })
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const addRoomNumber = () => {
    if (roomNumberInput.trim()) {
      const currentRoomNumbers = form.getFieldValue("roomNumbers") || [];
      if (!currentRoomNumbers.includes(roomNumberInput.trim())) {
        form.setFieldValue("roomNumbers", [
          ...currentRoomNumbers,
          roomNumberInput.trim()
        ]);
      }
      setRoomNumberInput("");
    }
  };

  const removeRoomNumber = (roomNumber: string) => {
    const currentRoomNumbers = form.getFieldValue("roomNumbers") || [];
    form.setFieldValue(
      "roomNumbers",
      currentRoomNumbers.filter((rn: string) => rn !== roomNumber)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRoomNumber();
    }
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <form.AppField
              name="roomTypeId"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Room Type</field.FormLabel>
                  <field.FormControl>
                    <Select
                      disabled={isPending}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypesData?.data?.map((roomType: any) => (
                          <SelectItem key={roomType.id} value={roomType.id}>
                            {roomType.name} - ${roomType.basePrice}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Room Numbers</label>
                {roomNumberInput.trim() ? (
                  <p className="text-[11px] font-bold text-blue-600 mt-0.5 animate-in fade-in">
                    Click the + button or press Enter to confirm room &quot;{roomNumberInput.trim()}&quot;
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Type a room number to get started.
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="e.g., 101, 102"
                    value={roomNumberInput}
                    onChange={(e) => setRoomNumberInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isPending}
                  />
                  <div className="relative isolate shrink-0">
                    {roomNumberInput.trim() && (
                      <span className="absolute -inset-1 rounded-md bg-blue-100 opacity-75 animate-ping -z-10" />
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addRoomNumber}
                      disabled={isPending || !roomNumberInput.trim()}
                      className={cn(
                        "relative bg-white transition-all duration-300",
                        roomNumberInput.trim() ? "border-blue-500 text-blue-400 shadow-md scale-105" : ""
                      )}
                    >
                      <Plus className={cn("h-4 w-4", roomNumberInput.trim() && "animate-pulse")} />
                    </Button>
                  </div>
                </div>
              </div>

              <form.AppField
                name="roomNumbers"
                children={(field) => (
                  <field.FormItem>
                    <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-lg bg-muted/50">
                      {field.state.value && field.state.value.length > 0 ? (
                        field.state.value.map((roomNumber: string) => (
                          <Badge
                            key={roomNumber}
                            variant="secondary"
                            className="flex items-center gap-1 pl-2 pr-1 py-1"
                          >
                            {roomNumber}
                            <button
                              type="button"
                              className="ml-1 rounded-full p-0.5 hover:bg-red-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const currentRoomNumbers = form.getFieldValue("roomNumbers") || [];
                                form.setFieldValue("roomNumbers", currentRoomNumbers.filter((rn: string) => rn !== roomNumber));
                              }}
                              aria-label={`Remove room ${roomNumber}`}
                            >
                              <X className="h-3.5 w-3.5 text-slate-500 hover:text-red-500" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Add room numbers above
                        </div>
                      )}
                    </div>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="floorNumber"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Floor Number</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="1"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              <form.AppField
                name="isAccessible"
                children={(field) => (
                  <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                    <field.FormControl>
                      <Checkbox
                        disabled={isPending}
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(!!checked)
                        }
                      />
                    </field.FormControl>
                    <div className="space-y-1 leading-none">
                      <field.FormLabel>Wheelchair Accessible</field.FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark these rooms as accessible for guests with
                        disabilities
                      </p>
                    </div>
                  </field.FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-8 flex">
            <Button
              icon={<CheckCircle2 />}
              loading={isPending}
              type="submit"
              className="w-full py-4"
              disabled={
                !form.getFieldValue("roomNumbers")?.length ||
                !form.getFieldValue("roomTypeId") ||
                !hotelId
              }
            >
              Create {form.getFieldValue("roomNumbers")?.length || 0} Rooms
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
