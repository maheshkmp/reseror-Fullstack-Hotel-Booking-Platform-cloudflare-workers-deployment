"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

import { useGetRoomById } from "../../api/use-get-rooms-by-id";
import { RoomBookingSchema } from "../core/zod/roomBooking.schema";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Component to display assigned rooms
const AssignedRoomsCell = ({ rooms }: { rooms: string[] | null }) => {
  if (!rooms || rooms.length === 0) {
    return <div className="max-w-32 truncate text-gray-500">None</div>;
  }

  return (
    <div className="max-w-40">
      <div className="flex flex-wrap gap-1">
        {rooms.slice(0, 2).map((roomId) => (
          <RoomBadge key={roomId} roomId={roomId} />
        ))}
        {rooms.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{rooms.length - 2} more
          </Badge>
        )}
      </div>
    </div>
  );
};

// Component to fetch and display individual room info
const RoomBadge = ({ roomId }: { roomId: string }) => {
  const { data: room, isLoading } = useGetRoomById(roomId);

  if (isLoading) {
    return (
      <Badge variant="outline" className="text-xs animate-pulse">
        Loading...
      </Badge>
    );
  }

  if (!room) {
    return (
      <Badge variant="destructive" className="text-xs">
        Room {roomId}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-xs">
      {room.roomNumber}
    </Badge>
  );
};

import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<RoomBookingSchema>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "guest",
    header: "Guest",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="size-7 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            {row.original.guestName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-[80px]">
            <span className="font-medium text-xs truncate max-w-[110px]">{row.original.guestName}</span>
            <span className="text-[9px] text-muted-foreground whitespace-nowrap">
              Booked: {new Date(row.original.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "stay",
    header: "Stay Details",
    cell: ({ row }) => {
      const formatTime = (time: string) => time || "";
      return (
        <div className="flex flex-col min-w-[110px]">
          <span className="text-xs whitespace-nowrap">
            {row.original.checkInDate} &rarr; {row.original.checkOutDate}
          </span>
          <span className="text-[9px] text-muted-foreground whitespace-nowrap">
            {formatTime(row.original.checkInTime)} - {formatTime(row.original.checkOutTime)}
          </span>
        </div>
      );
    },
  },
  {
    id: "occupancy",
    header: "Occupancy",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 w-[60px]">
          <Badge variant="outline" className="text-[9px] leading-tight px-1 py-0 h-4 justify-between border-muted-foreground/30">
            <span>{row.original.numRooms}</span>
            <span className="text-muted-foreground">Rm</span>
          </Badge>
          <Badge variant="outline" className="text-[9px] leading-tight px-1 py-0 h-4 justify-between border-muted-foreground/30">
            <span>{row.original.numAdults}</span>
            <span className="text-muted-foreground">Ad</span>
          </Badge>
          <Badge variant="outline" className="text-[9px] leading-tight px-1 py-0 h-4 justify-between border-muted-foreground/30">
            <span>{row.original.numChildren}</span>
            <span className="text-muted-foreground">Ch</span>
          </Badge>
        </div>
      );
    },
  },
  {
    id: "financials",
    header: "Financials",
    cell: ({ row }) => {
      const formatCurrency = (val: string | number) => {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.original.currency || "USD",
        }).format(Number(val));
      };

      return (
        <div className="flex flex-col text-[11px] space-y-0 w-[110px]">
          <div className="flex justify-between gap-1">
            <span className="text-muted-foreground text-[9px]">Total:</span>
            <span>{formatCurrency(row.original.totalAmount)}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span className="text-muted-foreground text-[9px]">Comm:</span>
            <span className="text-orange-500">{formatCurrency(row.original.commissionAmount)}</span>
          </div>
          <div className="flex justify-between gap-1 font-medium border-t border-border mt-0.5 pt-0.5">
            <span className="text-muted-foreground text-[9px]">Net:</span>
            <span className="text-green-600">{formatCurrency(row.original.netPayableToHotel)}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "status_combined",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isPaid = row.original.isPaid;
      
      const statusColors: Record<string, string> = {
        confirmed: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        cancelled: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      };
      
      const paymentColors = isPaid
        ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
        : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";

      return (
        <div className="flex flex-col gap-1 items-start w-[70px]">
          <Badge className={`text-[9px] uppercase font-bold tracking-wider rounded-sm px-1 py-0 shadow-none border ${statusColors[status] || "bg-secondary"}`} variant="outline">
            {status}
          </Badge>
          <Badge className={`text-[9px] uppercase font-bold tracking-wider rounded-sm px-1 py-0 shadow-none border ${paymentColors}`} variant="outline">
            {isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "rooms",
    header: "Rooms",
    cell: ({ row }) => <AssignedRoomsCell rooms={row.original.rooms} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction bookingId={row.original.id} initialData={row.original as any} />,
  },
];
