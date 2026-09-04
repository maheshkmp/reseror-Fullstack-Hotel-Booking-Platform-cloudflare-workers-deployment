"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Eye,
  MapPin,
  NotebookPen,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useUpdateRoomInformationByID } from "../../queries/use-update-room-information-by-id";
import { type RoomWithRelations } from "core/zod";

type Props = {
  room: RoomWithRelations;
  onViewBookings?: () => void;
};

export function RoomCard({ room, onViewBookings }: Props) {
  const [open, setOpen] = useState(false);

  // local state so card shows live updates
  const [status, setStatus] = useState(room.status || "available");
  const [note, setNote] = useState(room.note || ""); // ✅ initialize with existing note

  const mutation = useUpdateRoomInformationByID();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "occupied":
        return "destructive";
      case "maintenance":
        return "secondary";
      case "out_of_order":
        return "destructive";
      case "dirty":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "maintenance":
      case "out_of_order":
        return <Wrench className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleSave = async () => {
    try {
      await mutation.mutateAsync({
        id: room.id,
        data: {
          roomNumber: room.roomNumber,
          floorNumber: room.floorNumber,
          isAccessible: room.isAccessible,
          status: status as any,
          lastCleanedAt: room.lastCleanedAt,
          note: note, // ✅ persist note
        },
      });

      // ✅ update local state so UI reflects immediately
      room.status = status;
      room.note = note;

      setOpen(false);
    } catch (err) {
      console.error("Failed to update room:", err);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                Room {room.roomNumber}
              </CardTitle>
              {room.roomType && (
                <CardDescription>
                  {room.roomType.name}
                </CardDescription>
              )}
            </div>
            <Badge
              variant={getStatusColor(status)}
              className="flex items-center gap-1"
            >
              {getStatusIcon(status)}
              <span className="capitalize">{status.replace("_", " ")}</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {room.floorNumber && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Floor:</span>
                <span>{room.floorNumber}</span>
              </div>
            )}
            {room.isAccessible && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Accessible
                </Badge>
              </div>
            )}
          </div>

          {room.roomType && (
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Up to {room.roomType.maxOccupancy} guests</span>
              </div>
            </div>
          )}

          {/* ✅ Show note if available */}
          {note && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <NotebookPen className="h-4 w-4" />
              <span>{note}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Room
            </Button>
            <Button size="sm" onClick={onViewBookings} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View Bookings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Room Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room {room.roomNumber}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_order">Out of Order</SelectItem>
                  <SelectItem value="dirty">Dirty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Note</Label>
              <Input
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
