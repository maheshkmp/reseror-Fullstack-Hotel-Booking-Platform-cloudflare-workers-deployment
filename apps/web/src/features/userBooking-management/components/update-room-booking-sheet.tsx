"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetRooms } from "../api/use-get-rooms";
import { useUpdateRoomBookingById } from "../api/use-update-roomBokking-by-id";
import { RoomBookingSchema } from "core/zod";

interface UpdateRoomBookingSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  booking: RoomBookingSchema | null;
}

export function UpdateRoomBookingSheet({
  open,
  setOpen,
  booking,
}: UpdateRoomBookingSheetProps) {
  const { mutate: updateRoomBooking, isPending } = useUpdateRoomBookingById();

  // Fetch available rooms
  const { data: roomsData, isLoading: roomsLoading } = useGetRooms({
    limit: 100, // Get more rooms for selection
    status: "available",
  });

  const [formData, setFormData] = useState({
    numRooms: 1,
    paymentType: "cash" as "cash" | "online",
    status: "pending" as
      | "pending"
      | "confirmed"
      | "cancelled"
      | "checked_in"
      | "checked_out"
      | "no_show",
    notes: "",
    isPaid: false,
    rooms: [] as string[], // Array of room IDs
  });

  // Populate form when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        numRooms: booking.numRooms || 1,
        paymentType: booking.paymentType || "cash",
        status: booking.status || "pending",
        notes: booking.notes || "",
        isPaid: booking.isPaid || false,
        rooms: booking.rooms || [], // Populate existing rooms
      });
    }
  }, [booking]);

  const handleSubmit = () => {
    if (!booking) return;

    updateRoomBooking(
      {
        id: booking.id,
        data: {
          numRooms: formData.numRooms,
          paymentType: formData.paymentType,
          status: formData.status,
          notes: formData.notes || null,
          isPaid: formData.isPaid,
          rooms: formData.rooms, // Include selected rooms
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          console.error("Failed to update room booking:", error);
        },
      }
    );
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddRoom = (roomId: string) => {
    if (!formData.rooms.includes(roomId)) {
      setFormData((prev) => ({
        ...prev,
        rooms: [...prev.rooms, roomId],
      }));
    }
  };

  const handleRemoveRoom = (roomId: string) => {
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((id) => id !== roomId),
    }));
  };

  const getSelectedRoomNames = () => {
    if (!roomsData?.data) return [];
    return formData.rooms.map((roomId) => {
      const room = roomsData.data.find((r: any) => r.id === roomId);
      return room ? `${room.roomNumber} (${room.roomType?.name})` : roomId;
    });
  };

  const availableRooms =
    roomsData?.data?.filter((room: any) => !formData.rooms.includes(room.id)) ||
    [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6">
          <SheetTitle className="text-xl font-semibold text-gray-900">
            Update Room Booking
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            Modify booking details for{" "}
            <span className="font-medium text-gray-900">
              {booking?.guestName || "this guest"}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-2">
          {/* Number of Rooms */}
          <div className="space-y-3">
            <Label
              htmlFor="numRooms"
              className="text-sm font-medium text-gray-700"
            >
              Number of Rooms
            </Label>
            <Input
              id="numRooms"
              type="number"
              min="1"
              value={formData.numRooms}
              onChange={(e) =>
                handleInputChange("numRooms", parseInt(e.target.value) || 1)
              }
              disabled={isPending}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rooms Selection */}
          <div className="space-y-3">
            <Label
              htmlFor="rooms"
              className="text-sm font-medium text-gray-700"
            >
              Assigned Rooms
            </Label>

            {/* Selected Rooms Display */}
            {formData.rooms.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-blue-800 mb-3">
                  Selected Rooms ({formData.rooms.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {getSelectedRoomNames().map((roomName, index) => (
                    <Badge
                      key={formData.rooms[index]}
                      variant="secondary"
                      className="bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 transition-colors duration-200 px-3 py-1"
                    >
                      <span className="font-medium">{roomName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors duration-200"
                        onClick={() => handleRemoveRoom(formData.rooms[index])}
                        disabled={isPending}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Room Selection Dropdown */}
            <div className="space-y-2">
              <Select
                onValueChange={handleAddRoom}
                disabled={isPending || roomsLoading}
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300">
                  <SelectValue
                    placeholder={
                      roomsLoading
                        ? "🔄 Loading rooms..."
                        : availableRooms.length === 0
                          ? "No rooms available"
                          : "➕ Select a room to add"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableRooms.map((room: any) => (
                    <SelectItem
                      key={room.id}
                      value={room.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">
                          Room {room.roomNumber}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {room.roomType?.name}
                          {room.floorNumber && ` • Floor ${room.floorNumber}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.rooms.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <p className="text-xs text-amber-700">
                    No rooms selected. Choose rooms from the dropdown above.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Type */}
          <div className="space-y-3">
            <Label
              htmlFor="paymentType"
              className="text-sm font-medium text-gray-700"
            >
              Payment Type
            </Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => handleInputChange("paymentType", value)}
              disabled={isPending}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="cash"
                  className="cursor-pointer hover:bg-blue-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💵</span>
                    <span>Cash Payment</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="online"
                  className="cursor-pointer hover:bg-blue-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💳</span>
                    <span>Online Payment</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label
              htmlFor="status"
              className="text-sm font-medium text-gray-700"
            >
              Booking Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
              disabled={isPending}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="pending"
                  className="cursor-pointer hover:bg-yellow-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Pending</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="confirmed"
                  className="cursor-pointer hover:bg-blue-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Confirmed</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="cancelled"
                  className="cursor-pointer hover:bg-red-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Cancelled</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="checked_in"
                  className="cursor-pointer hover:bg-green-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Checked In</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="checked_out"
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span>Checked Out</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="no_show"
                  className="cursor-pointer hover:bg-orange-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>No Show</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <Label
                  htmlFor="isPaid"
                  className="text-sm font-medium text-green-800"
                >
                  Payment Status
                </Label>
                <p className="text-xs text-green-600">
                  {formData.isPaid ? "Payment received" : "Payment pending"}
                </p>
              </div>
            </div>
            <Switch
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) =>
                handleInputChange("isPaid", checked)
              }
              disabled={isPending}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700"
            >
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any special requirements, comments, or additional information..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              disabled={isPending}
              rows={4}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <SheetFooter className="flex gap-3 pt-6 border-t bg-gray-50/50">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="flex-1 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Update Booking
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
