"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { useCreateRoom } from "../../queries/rooms.query";
import { useGetRoomTypes } from "../../queries/use-get-rooms";
import { type CreateRoomInput } from "core/zod";

interface RoomSetupFormProps {
  hotelId: string;
  onSuccess?: () => void;
}

export function RoomSetupForm({ hotelId, onSuccess }: RoomSetupFormProps) {
  const createRoomMutation = useCreateRoom();
  const { data: roomTypes, isLoading: isLoadingRoomTypes } =
    useGetRoomTypes(hotelId);

  const form = useForm({
    defaultValues: {
      hotelId,
      roomNumber: "",
      roomTypeId: "",
      floorNumber: null as number | null,
      isAccessible: null as boolean | null,
      status: "available" as
        | "available"
        | "occupied"
        | "dirty"
        | "maintenance"
        | "out_of_order"
    } satisfies CreateRoomInput,
    onSubmit: async ({ value }) => {
      try {
        const room = await createRoomMutation.mutateAsync(value);
        onSuccess?.();
      } catch (error) {
        console.error("Failed to create room:", error);
      }
    }
  });

  const isLoading = createRoomMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Room</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Room Number */}
          <form.Field
            name="roomNumber"
            validators={{
              onChange: z.string().min(1, "Room number is required")
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Room Number</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter room number (e.g., 101, 201A)"
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          {/* Room Type */}
          <form.Field
            name="roomTypeId"
            validators={{
              onChange: z.string().min(1, "Room type is required")
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Room Type</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  disabled={isLoadingRoomTypes}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes?.data?.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          {/* Floor Number and Accessibility */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="floorNumber">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Floor Number (Optional)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    placeholder="Floor number"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="isAccessible">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Accessibility</Label>
                  <Select
                    value={field.state.value ? "true" : "false"}
                    onValueChange={(value) =>
                      field.handleChange(value === "true" ? true : false)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Accessible?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Not Accessible</SelectItem>
                      <SelectItem value="true">Accessible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          {/* Room Status */}
          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Initial Status</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as typeof field.state.value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="dirty">Needs Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="out_of_order">Out of Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Room...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
