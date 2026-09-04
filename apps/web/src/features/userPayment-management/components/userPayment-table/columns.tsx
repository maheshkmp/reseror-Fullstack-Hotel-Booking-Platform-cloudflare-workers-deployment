"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

import { RoomBookingSchema } from "@/features/roomBookings/schemas/roomBookings.schema";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<RoomBookingSchema>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-primary flex items-center justify-center text-sm text-primary-foreground">
            {row.original.guestName.slice(0, 2)}
          </div>
          <p>{row.original.guestName}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "guest Email",
    header: "Guest Email",
    cell: ({ row }) => row.original.guestEmail,
  },
  {
    accessorKey: "guest Phone",
    header: "Guest Phone",
    cell: ({ row }) => row.original.guestPhone,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },

  {
    accessorKey: "paymentType",
    header: "Payment Type",
    cell: ({ row }) => (
      <Badge
        variant={row.original.paymentType === "cash" ? "default" : "secondary"}
      >
        {row.original.paymentType}
      </Badge>
    ),
  },
  {
    accessorKey: "checkIn Date",
    header: "Check-In Date",
    cell: ({ row }) => row.original.checkInDate,
  },
  {
    accessorKey: "checkOut Date",
    header: "Check-Out Date",
    cell: ({ row }) => row.original.checkOutDate,
  },
  {
    accessorKey: "checkIn Time",
    header: "Check-In Time",
    cell: ({ row }) => row.original.checkInTime,
  },
  {
    accessorKey: "checkOut Time",
    header: "Check-Out Time",
    cell: ({ row }) => row.original.checkOutTime,
  },
  {
    accessorKey: "num Rooms",
    header: "Rooms",
    cell: ({ row }) => row.original.numRooms,
  },
  {
    accessorKey: "num Adults",
    header: "Adults",
    cell: ({ row }) => row.original.numAdults,
  },
  {
    accessorKey: "num Children",
    header: "Children",
    cell: ({ row }) => row.original.numChildren,
  },
  {
    accessorKey: "total Amount",
    header: "Total Amount",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.totalAmount} {row.original.currency}
      </div>
    ),
  },
  {
    accessorKey: "commission Amount",
    header: "Commission",
    cell: ({ row }) => (
      <div className="text-orange-600 font-medium">
        {row.original.commissionAmount} {row.original.currency}
      </div>
    ),
  },
  {
    accessorKey: "net Payable To Hotel",
    header: "Net Payable",
    cell: ({ row }) => (
      <div className="text-green-600 font-medium">
        {row.original.netPayableToHotel} {row.original.currency}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "confirmed"
          ? "default"
          : status === "pending"
            ? "secondary"
            : status === "cancelled"
              ? "destructive"
              : "outline";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "isPaid",
    header: "Payment Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isPaid ? "default" : "destructive"}>
        {row.original.isPaid ? "Paid" : "Unpaid"}
      </Badge>
    ),
  },
  {
    accessorKey: "specialRequests",
    header: "Special Requests",
    cell: ({ row }) => (
      <div className="max-w-32 truncate">
        {row.original.specialRequests || "None"}
      </div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="max-w-32 truncate">{row.original.notes || "None"}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction />,
  },
];
